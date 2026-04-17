"use client";

import { SearchNormal1, Setting2, Notification } from "iconsax-react";
import { useSidebar } from "./sidebar";

export function Header() {
  const { collapsed } = useSidebar();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 shrink-0"
      style={{
        height: 56,
        background: "var(--background)",
        borderBottom: "1px solid var(--sidebar-border)",
        // Ensure the header visually aligns with the content area
        // (margin is handled by the parent layout, not here)
      }}
      aria-label="Barra de navegação superior"
    >
      {/* ----------------------------------------------------------------- */}
      {/* Search                                                             */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center gap-2.5">
        <SearchNormal1 size={18} color="var(--muted-foreground)" />
        <input
          type="search"
          placeholder="Buscar qualquer coisa..."
          className="bg-transparent text-sm outline-none border-none"
          style={{
            color: "var(--muted-foreground)",
            width: collapsed ? 160 : 220,
            transition: "width 200ms ease",
          }}
          aria-label="Buscar"
        />
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
          style={{
            background: "var(--muted)",
            color: "var(--muted-foreground)",
          }}
          aria-label="Atalho de teclado Command K"
        >
          ⌘K
        </span>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Right actions                                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center gap-1">
        {/* Settings */}
        <button
          aria-label="Configurações"
          className="flex items-center justify-center p-2 rounded-lg transition-colors duration-150"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--foreground)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--muted)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--muted-foreground)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          <Setting2 size={18} color="currentColor" />
        </button>

        {/* Notifications — with red dot indicator */}
        <button
          aria-label="Notificações"
          className="relative flex items-center justify-center p-2 rounded-lg transition-colors duration-150"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--foreground)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--muted)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--muted-foreground)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          <Notification size={18} color="currentColor" />
          {/* Unread indicator dot */}
          <span
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              top: 6,
              right: 6,
              background: "var(--danger)",
            }}
            aria-hidden="true"
          />
        </button>

        {/* User avatar */}
        <div
          className="flex items-center justify-center rounded-full text-xs font-semibold shrink-0 ml-2 cursor-pointer"
          style={{
            width: 32,
            height: 32,
            background: "var(--accent)",
            color: "#ffffff",
          }}
          aria-label="Perfil do usuário"
          role="button"
          tabIndex={0}
        >
          EC
        </div>
      </div>
    </header>
  );
}
