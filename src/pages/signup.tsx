import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import {
  signUpSchema,
  type signupSchemaType,
} from "../common/validation/authSchemas";
import { trpc } from "../common/trpc";
import { TRPCClientError } from "@trpc/client";

const SignUp: NextPage = () => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<signupSchemaType>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync, isLoading } = trpc.signup.useMutation();

  const onSubmit = async (data: signupSchemaType) => {
    try {
      const result = await mutateAsync(data);
      if (result?.status === 201) {
        reset();
        await router.push("/");
      }
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        setStatusMessage(error.message);
      } else {
        setStatusMessage("An unexpected error has occurred.");
      }
    }
  };

  return (
    <div>
      <Head>
        <title>MediaTracker - Signup</title>
        <meta
          name="description"
          content="Signup page for your personal MediaTracker!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen items-center justify-center">
        <div className="flex max-w-md flex-col rounded-md border p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold">Sign up</h1>
            <p className="text-sm dark:text-gray-400">Sign up to get started</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e).catch((err) => console.error(err));
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm">
                Email
              </label>
              <input
                disabled={isLoading}
                id="email"
                type="email"
                placeholder="Enter an email..."
                className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm">
                Username
              </label>
              <input
                disabled={isLoading}
                id="username"
                type="text"
                placeholder="Enter an username..."
                className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register("username", {
                  required: "Username is required",
                  maxLength: {
                    value: 20,
                    message: "Username must be less than 20 characters",
                  },
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
              {errors.username && (
                <div className="text-red-500">{errors.username.message}</div>
              )}
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm">
                Pasword
              </label>
              <input
                disabled={isLoading}
                type="password"
                id="password"
                placeholder="*****"
                className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <div className="text-red-500">{errors.password.message}</div>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-violet-400 px-8 py-3 font-semibold hover:bg-violet-600 dark:text-gray-900 disabled:dark:bg-gray-500"
                >
                  Sign up
                </button>
              </div>
              <p className="px-6 text-center text-sm dark:text-gray-400">
                Already have an account yet?
                <Link
                  href="/login"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:underline"
                >
                  &nbsp;Login
                </Link>
                .
              </p>
            </div>
          </form>
          {statusMessage && (
            <div className="mt-4 rounded-md bg-red-100 p-2 text-red-600">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
