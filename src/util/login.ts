import { Page } from "@playwright/test";
import { decryptPassword } from "../lib/crypto";
import * as dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

interface EncryptedData {
  iv: string;
  content: string;
}

interface User {
  username: string;
  password: EncryptedData;
}

async function findUserByUsername(username: string): Promise<User | undefined> {
  const config = JSON.parse(
    fs.readFileSync("./config/dev.config.json", "utf8")
  );
  return config.users.find((user: User) => user.username === username);
}

export async function login(page: Page, username: string): Promise<void> {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error(`User with username ${username} not found`);
  }

  const { password } = user;
  const realPassword = decryptPassword(password);

  const baseUrl = process.env.BASE_URL || "https://www.saucedemo.com/";
  await page.goto(baseUrl);
  await page.fill("#user-name", username);
  await page.fill("#password", realPassword);
  await page.click("#login-button");
}
