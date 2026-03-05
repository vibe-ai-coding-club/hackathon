import * as z from "zod";

export const projectSubmitSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  title: z
    .string()
    .min(1, "프로젝트 이름을 입력해주세요")
    .max(100, "프로젝트 이름은 100자 이하로 입력해주세요"),
  description: z
    .string()
    .min(1, "프로젝트 설명을 입력해주세요")
    .max(2000, "프로젝트 설명은 2000자 이하로 입력해주세요"),
  githubUrl: z
    .string()
    .url("올바른 URL을 입력해주세요")
    .refine(
      (url) => {
        try {
          return new URL(url).hostname.endsWith("github.com");
        } catch {
          return false;
        }
      },
      { message: "GitHub 링크를 입력해주세요" },
    ),
  demoUrl: z
    .string()
    .url("올바른 URL을 입력해주세요")
    .optional()
    .or(z.literal("")),
});

export type ProjectSubmitInput = z.infer<typeof projectSubmitSchema>;
