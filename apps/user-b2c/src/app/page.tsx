"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Hero } from "@/components/Layout/Hero"
import { Main } from "@/components/Main"

export default function Home() {
    return (
      <AppLayout>
        <Main pageHeading='Dashvboard'>
          <Hero/>
        </Main>
      </AppLayout>
  );
}
