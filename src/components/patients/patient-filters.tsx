"use client";

import { SearchNormal1 } from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  conditionFilter: string;
  setConditionFilter: (value: string) => void;
  adherenceFilter: string;
  setAdherenceFilter: (value: string) => void;
}

const conditionTabs = [
  "Todos",
  "DM2",
  "Hipotireoidismo",
  "Obesidade",
  "Hipogonadismo",
  "Esteatose",
];

const adherenceTabs = ["Todos", "Aderente", "Baixa aderência", "Inativo"];

export function PatientFilters({
  searchQuery,
  setSearchQuery,
  conditionFilter,
  setConditionFilter,
  adherenceFilter,
  setAdherenceFilter,
}: PatientFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex items-center max-w-[320px] flex-1 min-w-0">
        <SearchNormal1
          size={14}
          color="currentColor"
          className="absolute left-2.5 text-muted-foreground shrink-0 pointer-events-none"
        />
        <Input
          type="text"
          placeholder="Buscar paciente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-sm"
          aria-label="Buscar paciente"
        />
      </div>

      <Separator orientation="vertical" className="h-5" aria-hidden="true" />

      {/* Condition tabs */}
      <Tabs
        value={conditionFilter}
        onValueChange={(value) => setConditionFilter(value as string)}
      >
        <TabsList aria-label="Filtrar por condição">
          {conditionTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Separator orientation="vertical" className="h-5" aria-hidden="true" />

      {/* Adherence tabs */}
      <Tabs
        value={adherenceFilter}
        onValueChange={(value) => setAdherenceFilter(value as string)}
      >
        <TabsList aria-label="Filtrar por aderência">
          {adherenceTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
