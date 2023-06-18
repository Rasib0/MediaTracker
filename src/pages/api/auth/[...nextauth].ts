import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";
import { prisma } from "../../../server/prisma";
import { loginSchema } from "~/common/validation/authSchemas";

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" },
            },

            authorize: async (credentials) => {
                try {
                    const { email, password } = await loginSchema.parseAsync(credentials);
                    const resultUser = await prisma.user.findFirst({
                        where: { email },
                    });
                    if (!resultUser) return null;

                    const isValidPassword = await verify(resultUser.password, password);
                    if (!isValidPassword) return null;

                    return {
                        id: resultUser.id.toString(),
                        email, username: resultUser.username
                    };
                } catch {
                    return null;
                }
            },
        }),

    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.userId = user.id;
                token.email = user.email;
                token.username = user.username;
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.userId = token.userId;
                session.user.email = token.email;
                session.user.username = token.username;
            }

            return session;
        },
    },
    jwt: {
        maxAge: 15 * 24 * 30 * 60, // 15 days
    },
    pages: {
        signIn: "/sign-in",
        newUser: "/sign-up",
    },
    secret: "super-secret",
};

export default NextAuth(nextAuthOptions);
