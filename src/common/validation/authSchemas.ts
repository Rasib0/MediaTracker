import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "password is at least 6 chars long" })
    .max(50, { message: "Too big" }),
}
);

export const signUpSchema = loginSchema.extend({
  username: z.string()
    .min(3, { message: "Must be at least 3 chars long" })
    .max(20, { message: "Relax you don't need a username that big" }),
  password: z
    .string()
    .min(6, { message: "Must be at least 6 chars long" })
    .max(50, { message: "Relax you don't need a password that big" }),
});

export const searchBookSchema = z.object({
  keywords: z.string().max(100),
});

export const searchSchema = searchBookSchema.extend({
  tags: z.string().max(20).array(),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
export type signupSchemaType = z.infer<typeof signUpSchema>;
