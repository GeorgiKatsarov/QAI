"use client";

import { Navbar } from "@/components/nav/Navbar";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/";

  return (
    <>
      {!hideNavbar ? <Navbar /> : null}
      <main className="flex-1">{children}</main>
    </>
  );
}
