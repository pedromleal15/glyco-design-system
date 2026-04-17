"use client";

import { SidebarProvider, Sidebar, useSidebar } from "./sidebar";
import { Header } from "./header";

// ---------------------------------------------------------------------------
// Inner layout — must live inside SidebarProvider to consume the context
// ---------------------------------------------------------------------------

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content shifts with the sidebar width */}
      <div
        className="flex-1 flex flex-col"
        style={{
          marginLeft: collapsed ? 64 : 220,
          transition: "margin-left 200ms ease",
        }}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div
            className="mx-auto px-8 py-6"
            style={{ maxWidth: 1400 }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export — wraps everything in the provider
// ---------------------------------------------------------------------------

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SidebarProvider>
  );
}
