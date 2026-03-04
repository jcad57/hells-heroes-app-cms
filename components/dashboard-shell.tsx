"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconChartBar,
  IconDashboard,
  IconListDetails,
  IconCalendar,
  IconMenu2,
  IconX,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
  IconNews,
  IconLink,
} from "@tabler/icons-react";
import { createClient } from "@/supabase/client";
import { signOut } from "@/lib/auth";
import Image from "next/image";
import hhlogo from "@/public/assets/images/hhviii-logo.png";

const NAV_ITEMS = [
  { title: "Overview", url: "/dashboard/overview", icon: IconChartBar },
  { title: "Newsfeed", url: "/dashboard/newsfeed", icon: IconNews },
  { title: "Bands", url: "/dashboard/bands", icon: IconDashboard },
  { title: "Stages", url: "/dashboard/stages", icon: IconListDetails },
  { title: "Show Dates", url: "/dashboard/show-dates", icon: IconCalendar },
  { title: "Links", url: "/dashboard/links", icon: IconLink },
];

// ── Presentational nav content ──────────────────────────────────────────────
// Defined outside DashboardShell so it has a stable component identity.

interface NavContentProps {
  collapsed: boolean;
  pathname: string;
  user: { name: string; email: string } | null;
  onNavClick: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

function NavContent({
  collapsed,
  pathname,
  user,
  onNavClick,
  onLogout,
  isLoggingOut,
}: NavContentProps) {
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={[
          "flex items-center border-b border-[#1e1e2e] flex-shrink-0 overflow-hidden hidden lg:flex",
          collapsed ? "px-4 py-5 justify-center" : "px-4 py-5 gap-3",
        ].join(" ")}
      >
        <Image
          src={hhlogo}
          alt="Hells Heroes Logo"
          width={350}
          height={350}
          className="object-contain"
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ title, url, icon: Icon }) => {
          const active = isActive(url);
          return (
            <Link
              key={url}
              href={url}
              onClick={onNavClick}
              title={title}
              className={[
                "relative flex items-center rounded-lg transition-all duration-200",
                collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5 gap-3",
                active
                  ? "text-[#3A97D4] bg-[#3A97D4]/10"
                  : "text-[#6b6b80] hover:text-[#e8e8f0] hover:bg-white/5",
              ].join(" ")}
            >
              {/* Left accent bar */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#3A97D4] rounded-r-full" />
              )}
              <Icon className="size-4 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className="border-t border-[#1e1e2e] p-2 flex-shrink-0">
          <div
            className={[
              "flex items-center rounded-lg px-2 py-2",
              collapsed ? "justify-center" : "gap-3",
            ].join(" ")}
          >
            <div className="w-7 h-7 rounded-full bg-[#f0c040]/20 border border-[#f0c040]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#f0c040] text-xs font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#e8e8f0] truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[#6b6b80] truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  title="Log out"
                  className="text-[#6b6b80] hover:text-[#e05a5a] transition-colors p-1 rounded disabled:opacity-50"
                >
                  <IconLogout className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({
          name: u.user_metadata?.full_name || u.email?.split("@")[0] || "User",
          email: u.email || "",
        });
      }
    });
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navProps: NavContentProps = {
    collapsed,
    pathname: pathname ?? "",
    user,
    onNavClick: () => setMobileOpen(false),
    onLogout: handleLogout,
    isLoggingOut,
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* ── Desktop sidebar ── */}
      {/* Wrapper handles width transition and is the positioning parent for the toggle */}
      <div
        className={[
          "hidden lg:block h-screen sticky top-0 flex-shrink-0 relative z-20 transition-[width] duration-300 ease-in-out",
          collapsed ? "w-16" : "w-60",
        ].join(" ")}
      >
        <aside className="flex flex-col h-full w-full bg-[#12121a] border-r border-[#1e1e2e] overflow-x-hidden">
          <NavContent {...navProps} collapsed={collapsed} />
        </aside>

        {/* Collapse toggle — outside the aside so overflow-x-hidden doesn't clip it */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[52px] w-6 h-6 rounded-full bg-[#1e1e2e] border border-[#2e2e3e] flex items-center justify-center text-[#6b6b80] hover:text-[#e8e8f0] hover:border-[#3A97D4]/40 hover:cursor-pointer transition-all z-30"
        >
          {collapsed ? (
            <IconChevronRight className="size-3" />
          ) : (
            <IconChevronLeft className="size-3" />
          )}
        </button>
      </div>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-3 px-4 bg-[#12121a] border-b border-[#1e1e2e]">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-[#6b6b80] hover:text-[#e8e8f0] transition-colors p-1"
        >
          <IconMenu2 className="size-5" />
        </button>
        <span className="font-bebas-neue text-xl tracking-[2px] bg-gradient-to-r from-[#3A97D4] to-white bg-clip-text text-transparent">
          Hell&apos;s Heroes
        </span>
      </div>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      {/* Drawer panel */}
      <aside
        className={[
          "lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#12121a] border-r border-[#1e1e2e] flex flex-col transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Close button */}
        <div className="flex items-center justify-between lg:justify-end px-4 h-14 border-b border-[#1e1e2e] flex-shrink-0">
          <span className="font-bebas-neue text-xl tracking-[2px] bg-gradient-to-r from-[#3A97D4] to-white bg-clip-text text-transparent block lg:hidden">
            Hell&apos;s Heroes
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-[#6b6b80] hover:text-[#e8e8f0] transition-colors p-1"
          >
            <IconX className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavContent {...navProps} collapsed={false} />
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
