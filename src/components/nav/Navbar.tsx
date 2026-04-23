"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, Calendar, Send, Bell, Home } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/map", label: "Map", icon: Map },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/submit", label: "Submit Event", icon: Send },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="border-b border-border bg-background sticky top-0 z-40"
      data-testid="navbar"
    >
      <div className="container mx-auto px-4 flex items-center gap-6 h-14">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight shrink-0"
          data-testid="nav-logo"
        >
          Roamer
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto" data-testid="nav-links">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              data-testid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
