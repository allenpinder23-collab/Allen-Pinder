import { NextRequest, NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdfParse";
import { generateClientPlan } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB per file
const MAX_STATEMENTS = 3;

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 }
    );
  }

  const clientNameRaw = formData.get("clientName");
  const clientName =
    typeof clientNameRaw === "string" && clientNameRaw.trim()
      ? clientNameRaw.trim()
      : undefined;

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
      return NextResponse.json(
        { error: `File "${f.name}" exceeds the 20MB limit.` },
        { status: 400 }
      );
    }
    if (f.type && f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: `File "${f.name}" must be a PDF.` },
        { status: 400 }
      );
    }
  }

  try {
    const [creditReportText, ...bankStatementTexts] = await Promise.all(
      allFiles.map(async (f) => {
        const buffer = Buffer.from(await f.arrayBuffer());
        return extractPdfText(buffer);
      })
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
      clientName,
      creditReportText,
      bankStatementTexts,
    });

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("Analyze route failed:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected error generating the plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
