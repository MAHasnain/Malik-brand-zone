"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import AdminSidebarWrapper from "./AdminSidebarWrapper";

export default function AdminShell({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();

  if (segment === "login") {
    return (
      <main className="grid min-h-svh w-full place-items-center bg-[var(--paper)] py-6 text-[var(--ink)]">
        <div className="w-full">
          <Image
            src="/MBZ-black.png"
            alt="Malik Brand Zone"
            width={64}
            height={64}
            className="mx-auto dark:invert"
          />
          {children}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-svh bg-gray-50">
      <AdminSidebarWrapper>
        <main className="min-w-0 w-full flex-1">{children}</main>
      </AdminSidebarWrapper>
    </div>
  );
}
