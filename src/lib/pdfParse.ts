import { PDFParse } from "pdf-parse";

/**
 * Extracts text from an uploaded PDF. Works for text-based PDFs (most
 * bureau credit reports and bank statements). Scanned/image-only PDFs will
 * return little or no text — callers should surface that to the user.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
