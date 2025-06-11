"use client";

import { createNotFoundState } from '@/components/ui/DataStates';

// Create a category-specific not found state component
export const CategoryNotFoundState = createNotFoundState('category', '/categories');
