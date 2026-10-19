"use client";

import React from "react";
import { StorageProvider } from "@/context/StorageContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <StorageProvider>{children}</StorageProvider>;
}
