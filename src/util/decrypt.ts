import * as fs from "fs";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

const algorithm = "aes-256-ctr";
const secretKey =
  process.env.PLAYWRIGHT_SECRET || "1ozxPWVZEAvdYlTGtNbbxwYXf1S1MVFR"; //replace with your own secret key

interface EncryptedData {
  iv: string;
  content: string;
}

interface User {
  username: string;
  password: EncryptedData;
  type: string;
}

function decrypt(encrypted: EncryptedData): string {
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

function decryptUserPasswords(fileName: string): void {
  const data = fs.readFileSync(`./config/${fileName}`, "utf8");
  const config = JSON.parse(data);
  console.log(`Decrypting passwords for ${fileName}`);

  config.users.forEach((user: User) => {
    const { iv, content } = user.password;
    if (/^[0-9A-Fa-f]+$/.test(iv) && /^[0-9A-Fa-f]+$/.test(content)) {
      const decryptedPassword = decrypt(user.password);
      console.log(
        `User: ${user.username} Password: ${decryptedPassword} Type: ${user.type}`
      );
    }
  });
}

const environment = process.env.ENV || "dev";
decryptUserPasswords(`${environment}.config.json`);
