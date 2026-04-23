import Link from "next/link";
import { LayoutDashboard, CalendarCheck, Inbox, Globe } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarCheck },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/sources", label: "Sources", icon: Globe },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" data-testid="admin-layout">
      <aside
        className="w-56 shrink-0 border-r border-border bg-muted/40 flex flex-col"
        data-testid="admin-sidebar"
      >
        <div className="h-14 flex items-center px-4 border-b border-border font-bold text-sm">
          Roamer Admin
        </div>
        <nav className="p-2 flex flex-col gap-1">
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-testid={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
