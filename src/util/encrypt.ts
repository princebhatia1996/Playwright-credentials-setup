import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";
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
  password: string | EncryptedData;
  type: string;
}

function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

function processUserPasswords(config: { users: User[] }, file: string): void {
  config.users.forEach((user) => {
    if (
      typeof user.password === "object" &&
      /^[0-9A-Fa-f]+$/.test(user.password.iv) &&
      /^[0-9A-Fa-f]+$/.test(user.password.content)
    ) {
      console.log(
        `${file} - Password for user ${user.username} is already encrypted`
      );
      return;
    }

    const encryptedPassword = encrypt(user.password as string);
    user.password = encryptedPassword;
    console.log(
      `${file} - Password for user ${user.username} has been encrypted`
    );
  });
}

function encryptUserPasswords(): void {
  const configDir = "./config";
  const files = fs.readdirSync(configDir);

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const data = fs.readFileSync(path.join(configDir, file), "utf8");
      const config = JSON.parse(data);
      processUserPasswords(config, file);
      fs.writeFileSync(
        path.join(configDir, file),
        JSON.stringify(config, null, 2)
      );
    }
  });
}

// Run with yarn encrypt
encryptUserPasswords();
