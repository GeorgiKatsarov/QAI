"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, Calendar, Send, Bell, Sparkles } from "lucide-react";

const links = [
  { href: "/map",           label: "Map",           icon: Map },
  { href: "/calendar",      label: "Calendar",      icon: Calendar },
  { href: "/submit",        label: "Submit Event",  icon: Send },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b border-border"
      style={{
        background: "color-mix(in srgb, #FFFFFF 80%, #BED9F2 20%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      data-testid="navbar"
    >
      <div className="container mx-auto px-5 flex items-center gap-6 h-[3.75rem]">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 shrink-0 group"
          data-testid="nav-logo"
        >
          <span
            className="flex items-center justify-center size-7 rounded-lg text-white text-xs"
            style={{ background: "linear-gradient(135deg, #4A9ADE, #9BCBF0)" }}
          >
            <Sparkles className="size-3.5" />
          </span>
          <span
            className="font-extrabold text-xl tracking-tight"
            style={{ color: "#1A4068" }}
          >
            Roamer
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 overflow-x-auto" data-testid="nav-links">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                data-testid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                  active
                    ? "text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                style={
                  active
                    ? { background: "linear-gradient(135deg, #4A9ADE, #7BBDE8)" }
                    : undefined
                }
              >
                <Icon className="size-3.5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
