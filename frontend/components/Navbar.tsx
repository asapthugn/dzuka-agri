"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-primary">
            <Sprout className="w-6 h-6 text-accent" />
            <span>Dzuka Agri</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/#agents" className="hover:text-primary transition-colors">
              Agents
            </Link>
          </div>

          <Link
            href="/analyze"
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
              pathname === "/analyze"
                ? "bg-primary text-white"
                : "bg-accent text-white hover:bg-accent-dark"
            }`}
          >
            Analyze My Farm
          </Link>
        </div>
      </div>
    </nav>
  );
}
