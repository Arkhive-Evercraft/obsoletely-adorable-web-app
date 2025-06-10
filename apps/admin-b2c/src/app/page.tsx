"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from "@/components/Main"

export default function Home() {
    return (
      <AppLayout>
        <Main 
          pageHeading='Dashboard'
        />
      </AppLayout>
  );
}
