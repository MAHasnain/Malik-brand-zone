"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post<{
        accessToken?: string;
        token?: string;
        data?: { accessToken?: string };
      }>("/auth/login", { email, password });
      const data = res.data;

      const token = data?.accessToken || data?.token || data?.data?.accessToken;
      if (typeof token !== "string" || !token) {
        toast.error("Sign-in failed. Please try again.");
        return;
      }
      localStorage.setItem("accessToken", token);

      document.cookie = `accessToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      if (res.status === 200 || res.status === 201) {
        router.push("/admin/products");
      }

    } catch (error: unknown) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(typeof message === "string" ? message : "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section data-mbz-admin-login aria-labelledby="admin-login-title" className="grid w-full min-w-0 flex-1 place-items-center bg-brand-paper px-4 py-10 sm:py-16">
      {/* The storefront header, main and footer can share an outer flex wrapper. */}
      <style>{`
        :where(body, div, section, main):has(> header):has(> footer):has([data-mbz-admin-login]) {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          width: 100%;
          min-height: 100svh;
          padding: 0;
          gap: 0;
        }
        main:has(> [data-mbz-admin-login]) {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          flex: 1;
        }
      `}</style>
      <div className="w-full min-w-0 max-w-md rounded-2xl border border-(--line) bg-brand-surface p-5 shadow-sm sm:p-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 block mb-1">
            Malik Brand Zone
          </span>
          <h1 id="admin-login-title" className="text-2xl font-serif font-bold text-gray-900">Admin Portal</h1>
          <p className="mt-2 text-sm text-brand-muted">Sign in to manage catalog & inventory</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold uppercase text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="admin-email"
              autoComplete="username"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@malikbrandzone.com"
              className="min-h-12 w-full min-w-0 rounded-lg border border-(--line) bg-brand-paper px-4 py-3 text-base text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold uppercase text-gray-700 mb-2">
              Password
            </label>
            <input
              id="admin-password"
              autoComplete="current-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="min-h-12 w-full min-w-0 rounded-lg border border-(--line) bg-brand-paper px-4 py-3 text-base text-brand-ink focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-brand-primary text-(--on-plum) text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg hover:brightness-95 disabled:opacity-50 transition shadow-sm mt-2"
          >
            {loading ? "Authenticating..." : "Login to Admin Desk"}
          </button>
        </form>
      </div>
    </section>
  );
}