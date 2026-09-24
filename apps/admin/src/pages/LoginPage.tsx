import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAdminLogin } from "../hooks/useAdminAuth.js";

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from =
    (location.state as { from?: string } | null)?.from ?? "/";

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      await login.mutateAsync({
        email,
        password,
      });

      navigate(from, { replace: true });
    } catch {
      // Error is displayed below through login.error
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3A36] text-sm font-semibold text-white">
              JB
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#6B6B6B]">
              Sign in to manage your JustBuy store.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7E5E2] bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#171717]"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    className="h-11 w-full rounded-xl border border-[#E7E5E2] bg-white pl-10 pr-4 text-sm text-[#171717] outline-none transition placeholder:text-[#9A9A9A] focus:border-[#1F3A36] focus:ring-2 focus:ring-[#EEF3F1]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#171717]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
                  />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-11 w-full rounded-xl border border-[#E7E5E2] bg-white pl-10 pr-4 text-sm text-[#171717] outline-none transition placeholder:text-[#9A9A9A] focus:border-[#1F3A36] focus:ring-2 focus:ring-[#EEF3F1]"
                  />
                </div>
              </div>

              {login.isError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {login.error instanceof Error
                    ? login.error.message
                    : "Unable to sign in. Please check your credentials."}
                </div>
              )}

              <button
                type="submit"
                disabled={login.isPending}
                className="h-11 w-full rounded-xl bg-[#1F3A36] px-4 text-sm font-medium text-white transition hover:bg-[#172D2A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {login.isPending ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-[#9A9A9A]">
            JustBuy Admin
          </p>
        </div>
      </div>
    </main>
  );
}