"use server";

import { adminLoginSchema } from "@/lib/validations/admin";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

type ActionState = {
  success: boolean;
  message: string;
};

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24시간

const getSecret = () => {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not set");
  return secret;
};

const createSignature = (timestamp: string): string => {
  return createHmac("sha256", getSecret()).update(timestamp).digest("hex");
};

export const verifyAdminSession = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return false;

  const [timestamp, signature] = session.split(".");
  if (!timestamp || !signature) return false;

  const expectedSignature = createSignature(timestamp);

  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    if (sigBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
};

export const adminLogin = async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
  const raw = { password: formData.get("password") };
  const result = adminLoginSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      message: "비밀번호를 입력해주세요.",
    };
  }

  const { password } = result.data;
  const adminPassword = getSecret();

  const inputBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(adminPassword);

  const isValid = inputBuffer.length === expectedBuffer.length && timingSafeEqual(inputBuffer, expectedBuffer);

  if (!isValid) {
    return {
      success: false,
      message: "비밀번호가 올바르지 않습니다.",
    };
  }

  const timestamp = Date.now().toString();
  const signature = createSignature(timestamp);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${timestamp}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/admin",
  });

  return {
    success: true,
    message: "로그인 성공",
  };
};

export const adminLogout = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
};
