"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "@/types/site-config";

const SiteConfigContext = createContext<SiteConfig | null>(null);

export function SiteConfigProvider({
  value,
  children
}: {
  value: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  const ctx = useContext(SiteConfigContext);

  if (!ctx) {
    throw new Error(
      "useSiteConfig must be used inside <SiteConfigProvider>"
    );
  }

  return ctx;
}
