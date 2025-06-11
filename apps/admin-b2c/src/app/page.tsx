"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from "@/components/Main"

// Disable static generation for this auth-dependent page
export const dynamic = 'force-dynamic';

export default function Home() {
    return (
      <AppLayout requireAuth={true}>
        <Main pageHeading='Dashboard' />
      </AppLayout>
  );
}