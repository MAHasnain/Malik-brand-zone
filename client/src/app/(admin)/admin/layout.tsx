import type { ReactNode } from "react";
import AdminSessionGuard from "./AdminSessionGuard";
import AdminSidebarWrapper from "./AdminSidebarWrapper";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminSessionGuard>
      <AdminSidebarWrapper>{children}</AdminSidebarWrapper>
    </AdminSessionGuard>
  );
}