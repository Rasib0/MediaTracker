import {t} from '../trpc'
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import * as z from "zod";
import { hash } from "argon2";
import { any, number, string } from "zod";
import { signUpSchema, searchSchema, searchBookSchema } from "../../common/validation/authSchemas";

export const onboardingRouter = t.router({

  // ----------------- SIGN IN PROCEDURES ---------------------
  signup: t.procedure.input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input;
      // ERROR CHECKS
      const existsEmail = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (existsEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists.",
        });
      }

      const existsUserName = await ctx.prisma.user.findFirst({
        where: { username },
      });

      if (existsUserName) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists.",
        });
      }
      // ACTUAL CODE

      const hashedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
});
