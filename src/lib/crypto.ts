import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be set to a 32-byte hex string (64 characters). Generate one with: openssl rand -hex 32"
    );
  }
  return Buffer.from(hex, "hex");
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/** Encrypts a plaintext string with AES-256-GCM. Used for at-rest storage of plan data. */
export function encryptString(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptString(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

/** One-way hash used for session bearer tokens (store the hash, never the raw token). */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}
