import { type NextPage } from "next";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Head from "next/head";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  loginSchema,
  type loginSchemaType,
} from "../common/validation/authSchemas";

const Login: NextPage = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  // I removed the useCallback here
  const onSubmit = async (data: loginSchemaType) => {
    try {
      setIsFetching(true);
      await signIn("credentials", {
        ...data,
        redirect: false,
        callbackUrl: "/",
      }).then((res) => {
        setIsFetching(false);

        if (res?.error) {
          setStatusMessage("username or password is incorrect");
        }

        if (res?.url) {
          setStatusMessage("");
          void router.push(res.url);
        }
      });
      reset();
    } catch (err) {
      setStatusMessage(`An unkown error occured`);
    }
  };

  return (
    <div>
      <Head>
        <title>MediaTracker - Login</title>
        <meta
          name="description"
          content="Login page for your personal MediaTracker!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen items-center justify-center">
        <div className="flex max-w-md flex-col rounded-md border p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold">Sign in</h1>
            <p className="text-sm dark:text-gray-400">
              Sign in to access your account
            </p>
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
                disabled={isFetching}
                type="email"
                id="email"
                placeholder="Enter your email..."
                className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm">
                Pasword
              </label>
              <input
                disabled={isFetching}
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
                  disabled={isFetching}
                  className="w-full rounded-md bg-violet-400 px-8 py-3 font-semibold dark:text-gray-900 hover:bg-violet-600 disabled:dark:bg-gray-500"
                >
                  Sign in
                </button>
              </div>
              <p className="px-6 text-center text-sm dark:text-gray-400">
                Don&apos;t have an account yet?
                <Link
                  href="/signup"
                  rel="noopener noreferrer"
                  className="hover:underline dark:text-violet-400"
                >
                  &nbsp;Sign up
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

export default Login;
