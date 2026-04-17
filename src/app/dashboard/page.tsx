import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Bem-vindo ao MedDash
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/dashboard/bioimpedancia"
          className="bg-card border border-border-subtle rounded-xl p-6 hover:border-border transition-colors"
        >
          <h3 className="font-medium">Bioimpedância</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhamento de composição corporal
          </p>
        </Link>
      </div>
    </div>
  );
}
