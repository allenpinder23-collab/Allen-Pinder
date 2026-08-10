import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkApiAuth, logAudit } from "@/lib/auth";
import { extractPdfText } from "@/lib/pdfParse";
import { generateClientPlan } from "@/lib/claude";
import { encryptString } from "@/lib/crypto";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_STATEMENTS = 3;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await checkApiAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = auth.user;
  const { id: clientId } = await params;

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const creditReportFile = formData.get("creditReport");
  if (!(creditReportFile instanceof File)) {
    return NextResponse.json(
      { error: "A credit report PDF is required (field: creditReport)." },
      { status: 400 }
    );
  }

  const statementFiles = formData
    .getAll("bankStatements")
    .filter((f): f is File => f instanceof File);

  if (statementFiles.length === 0) {
    return NextResponse.json(
      { error: "At least one bank statement PDF is required (field: bankStatements)." },
      { status: 400 }
    );
  }
  if (statementFiles.length > MAX_STATEMENTS) {
    return NextResponse.json(
      { error: `At most ${MAX_STATEMENTS} bank statements are supported.` },
      { status: 400 }
    );
  }

  const allFiles = [creditReportFile, ...statementFiles];
  for (const f of allFiles) {
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `File "${f.name}" exceeds the 20MB limit.` }, { status: 400 });
    }
    if (f.type && f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: `File "${f.name}" must be a PDF.` }, { status: 400 });
    }
  }

  try {
    const [creditReportText, ...bankStatementTexts] = await Promise.all(
      allFiles.map(async (f) => extractPdfText(Buffer.from(await f.arrayBuffer())))
    );

    if (!creditReportText || creditReportText.length < 50) {
      return NextResponse.json(
        {
          error:
            "Couldn't extract readable text from the credit report PDF. It may be a scanned image — please upload a text-based PDF export.",
        },
        { status: 422 }
      );
    }

    const plan = await generateClientPlan({
      clientName: client.fullName,
      creditReportText,
      bankStatementTexts,
    });

    const encrypted = encryptString(JSON.stringify(plan));

    const saved = await prisma.plan.create({
      data: {
        clientId: client.id,
        generatedById: user.id,
        encryptedData: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        scoreRangeLabel: plan.currentScoreEstimate.range,
        monthlyCashFlow: plan.monthlyCashFlow,
        targetIncrease: plan.targetScoreIncrease,
      },
    });

    await prisma.client.update({ where: { id: client.id }, data: { updatedAt: new Date() } });

    await logAudit({
      userId: user.id,
      action: "plan_generated",
      targetType: "plan",
      targetId: saved.id,
      metadata: { clientId: client.id },
    });

    return NextResponse.json({ planId: saved.id });
  } catch (err) {
    console.error("Plan generation failed:", err);
    const message = err instanceof Error ? err.message : "Unexpected error generating the plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
