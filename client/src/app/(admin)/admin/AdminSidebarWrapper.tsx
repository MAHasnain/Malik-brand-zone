"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AdminNav from "./AdminNav";

export default function AdminSidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    function resize() { if (desktop.matches) dialog.current?.close(); }
    desktop.addEventListener("change", resize);
    return () => desktop.removeEventListener("change", resize);
  }, []);

  if (pathname === "/admin/login" || pathname === "/admin/login/") return <>{children}</>;

  return <div className="min-h-svh bg-brand-paper text-brand-ink md:flex">
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col overflow-hidden border-r border-(--line) bg-brand-surface md:flex">
      <p className="border-b border-(--line) p-6 font-serif text-xl font-bold">MBZ ADMIN</p>
      <AdminNav />
    </aside>
    <div className="min-w-0 flex-1">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-(--line) bg-brand-surface px-4 py-2 md:hidden">
        <span className="font-serif text-lg font-bold">MBZ ADMIN</span>
        <button type="button" aria-haspopup="dialog" aria-controls="admin-menu" aria-label="Open navigation" className="grid size-11 place-items-center" onClick={() => dialog.current?.showModal()}><Menu /></button>
      </div>
      {children}
    </div>
    <dialog id="admin-menu" ref={dialog} aria-labelledby="admin-menu-title" onClick={e => {
      if (e.target === e.currentTarget && e.clientX > e.currentTarget.getBoundingClientRect().right) dialog.current?.close();
    }} className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] flex-col overflow-hidden open:flex bg-brand-surface text-brand-ink backdrop:bg-black/50">
      <div className="flex items-center justify-between border-b border-(--line) px-4 py-2">
        <span id="admin-menu-title" className="font-serif text-lg font-bold">MBZ ADMIN</span>
        <button type="button" aria-label="Close navigation" className="grid size-11 place-items-center" onClick={() => dialog.current?.close()}><X /></button>
      </div>
      <AdminNav onNavigate={() => dialog.current?.close()} />
    </dialog>
  </div>;
}
