"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  const isLoginPage = pathname === "/login";

  if (isLoginPage || !user) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="ml-60 flex-1 min-h-screen">{children}</div>
    </>
  );
}
