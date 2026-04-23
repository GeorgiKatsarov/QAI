"use client";

import { Navbar } from "@/components/nav/Navbar";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/";

  return (
    <>
      {showNavbar ? <Navbar /> : null}
      <main className="flex-1">{children}</main>
    </>
  );
}
