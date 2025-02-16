import crypto from "crypto";
export function decryptPassword(encrypted: { iv: string; content: string }) {
  const algorithm = "aes-256-ctr";
  const secretKey =
    process.env.PLAYWRIGHT_SECRET || "1ozxPWVZEAvdYlTGtNbbxwYXf1S1MVFR"; //replace with your own secret key
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(encrypted.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
}
