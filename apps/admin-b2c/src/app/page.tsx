"use client";

import React from 'react';
import { ThemeProvider } from "@repo/ui/components";
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from "@/components/Main"

export default function Home() {
    return (
    <ThemeProvider>
      <AppLayout>
        <Main/>
      </AppLayout>
    </ThemeProvider>
  );
}
