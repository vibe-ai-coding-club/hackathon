import { z } from "zod";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});
