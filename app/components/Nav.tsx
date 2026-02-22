"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-semibold text-zinc-100 tracking-tight">
          Mission Control <span className="text-lg">🦊</span>
        </span>
        <div className="flex gap-1">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              path === "/"
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            Tasks
          </Link>
          <Link
            href="/calendar"
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              path === "/calendar"
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            Calendar
          </Link>
        </div>
      </div>
    </nav>
  );
}
