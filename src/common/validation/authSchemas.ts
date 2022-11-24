import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = loginSchema.extend({
  username: z.string(),
});


export const  searchBookSchema = z.object({
  keywords: z.string().max(100),
});

export const searchSchema = searchBookSchema.extend({
  tags: z.string().max(20).array(),
})


export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;

