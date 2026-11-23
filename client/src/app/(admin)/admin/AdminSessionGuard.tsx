"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { api } from "@/lib/axios";

function expiresAt(token: string | null): number {
  if (!token) return 0;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims: unknown = JSON.parse(atob(payload));
    if (claims && typeof claims === "object" && "exp" in claims &&
        typeof claims.exp === "number" && Number.isFinite(claims.exp)) {
      return claims.exp * 1000;
    }
  } catch {
    // Missing or malformed session.
  }
  return 0;
}

function ProtectedSession({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    let leaving = false;

    function endSession() {
      if (leaving) return;
      leaving = true;
      window.clearTimeout(timer);
      setReady(false);
      for (const name of ["accessToken", "refreshToken"]) {
        localStorage.removeItem(name);
        document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax";
      }
      const from = window.location.pathname + window.location.search;
      window.location.replace("/admin/login?" + new URLSearchParams({ from }));
    }

    function check() {
      if (leaving) return;
      window.clearTimeout(timer);
      const remaining = expiresAt(localStorage.getItem("accessToken")) - Date.now();
      if (remaining <= 0) return endSession();
      setReady(true);
      timer = window.setTimeout(check, Math.min(remaining, 2147483647));
    }

    function onStorage(event: StorageEvent) {
      if (event.key === "accessToken" || event.key === null) check();
    }

    const interceptor = api.interceptors.response.use(undefined, (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const current = localStorage.getItem("accessToken");
        const sent = error.config?.headers?.Authorization;
        if (!current || sent === "Bearer " + current) endSession();
      }
      return Promise.reject(error);
    });

    check();
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearTimeout(timer);
      api.interceptors.response.eject(interceptor);
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return ready ? children : null;
}

export default function AdminSessionGuard({ children }: { children: ReactNode }) {
  const path = usePathname();
  if (path.replace(/\/$/, "") === "/admin/login") return children;
  return <ProtectedSession key={path}>{children}</ProtectedSession>;
}
