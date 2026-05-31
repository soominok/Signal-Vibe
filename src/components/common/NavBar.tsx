"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "요약",       href: "/"             },
  { label: "국내",       href: "/domestic"     },
  { label: "해외",       href: "/global"       },
  { label: "자동트레이딩", href: "/auto-trading" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="text-sm font-bold tracking-tight">📡 재테크 레이더</span>
        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
