"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Category,
  People,
  Weight,
  Calendar,
  DocumentText,
  Chart,
  Setting2,
  ArrowLeft2,
  LogoutCurve,
  Gift,
} from "iconsax-react";

// ---------------------------------------------------------------------------
// Sidebar context
// ---------------------------------------------------------------------------

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      {children}
    </SidebarContext>
  );
}

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Category },
  { label: "Pacientes", href: "/dashboard/pacientes", icon: People },
  { label: "Bioimpedância", href: "/dashboard/bioimpedancia", icon: Weight },
  { label: "Agenda", href: "/dashboard/agenda", icon: Calendar },
  { label: "Protocolos", href: "/dashboard/protocolos", icon: DocumentText },
  { label: "Relatórios", href: "/dashboard/relatorios", icon: Chart },
  { label: "Configurações", href: "/dashboard/configuracoes", icon: Setting2 },
];

// ---------------------------------------------------------------------------
// Sidebar component
// ---------------------------------------------------------------------------

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      style={{
        width: collapsed ? 64 : 220,
        minWidth: collapsed ? 64 : 220,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        transition: "width 200ms ease, min-width 200ms ease",
      }}
      className="fixed left-0 top-0 h-screen flex flex-col z-40 overflow-hidden"
    >
      {/* ----------------------------------------------------------------- */}
      {/* Logo area                                                          */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="flex items-center gap-2.5 px-4 h-[56px] shrink-0"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        {/* "M" logo mark */}
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 text-sm font-bold"
          style={{
            background: "var(--foreground)",
            color: "var(--background)",
          }}
          aria-hidden="true"
        >
          M
        </div>

        {/* Brand name — hidden when collapsed */}
        {!collapsed && (
          <span
            className="text-sm font-semibold tracking-tight whitespace-nowrap"
            style={{ color: "var(--foreground)" }}
          >
            MedDash
          </span>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Collapse toggle button                                             */}
      {/* ----------------------------------------------------------------- */}
      <button
        onClick={toggle}
        aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        className="absolute top-4 flex items-center justify-center rounded-full cursor-pointer"
        style={{
          right: -12,
          width: 24,
          height: 24,
          background: "var(--sidebar-bg)",
          border: "1px solid var(--sidebar-border)",
          color: "var(--muted-foreground)",
          zIndex: 50,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        >
          <ArrowLeft2 size={12} color="currentColor" />
        </span>
      </button>

      {/* ----------------------------------------------------------------- */}
      {/* Navigation                                                         */}
      {/* ----------------------------------------------------------------- */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2">
        {/* Section label */}
        {!collapsed && (
          <p
            className="px-3 pt-5 pb-2 text-[10px] uppercase tracking-widest font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Menu Principal
          </p>
        )}

        {collapsed && <div className="pt-4" />}

        <ul className="flex flex-col gap-0.5" role="list">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
                  style={{
                    color: active
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                    background: active
                      ? "var(--sidebar-active)"
                      : "transparent",
                    fontWeight: active ? 500 : 400,
                    justifyContent: collapsed ? "center" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--sidebar-hover)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--foreground)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--muted-foreground)";
                    }
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={18} color="currentColor" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* Bottom section                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="shrink-0">
        {/* "Mudar para Pro" card — hidden when collapsed */}
        {!collapsed && (
          <div className="mx-3 p-3 rounded-lg" style={{ background: "var(--sidebar-active)", border: "1px solid var(--sidebar-border)" }}>
            <div className="flex items-start gap-2.5">
              <Gift size={20} color="var(--accent)" />
              <div className="flex flex-col gap-1 min-w-0">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Mudar para Pro
                </span>
                <span
                  className="text-[10px] leading-snug"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Desbloqueie análises avançadas e suporte prioritário.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Separator */}
        {!collapsed && (
          <div
            className="mx-3 my-2"
            style={{ borderTop: "1px solid var(--sidebar-border)" }}
          />
        )}

        {/* User card */}
        <div
          className="px-3 py-2 flex items-center gap-3 mb-2"
          style={{ justifyContent: collapsed ? "center" : undefined }}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-full shrink-0 text-xs font-semibold"
            style={{
              width: 32,
              height: 32,
              background: "var(--accent-muted)",
              color: "var(--accent)",
            }}
            aria-hidden="true"
          >
            EC
          </div>

          {/* Name + email — hidden when collapsed */}
          {!collapsed && (
            <>
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className="text-sm font-medium truncate leading-tight"
                  style={{ color: "var(--foreground)" }}
                >
                  Ethan Cole
                </span>
                <span
                  className="text-xs truncate leading-tight"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  ethan@meddash.io
                </span>
              </div>

              {/* Logout button */}
              <button
                aria-label="Sair"
                className="flex items-center justify-center p-1 rounded-md transition-colors duration-150 shrink-0"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--muted-foreground)";
                }}
              >
                <LogoutCurve size={16} color="currentColor" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
