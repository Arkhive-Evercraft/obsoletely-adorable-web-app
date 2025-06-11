"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/DataStates';
import { BackButton } from '@/components/legacy-buttons/ActionButtons';

/**
 * Creates a domain-specific not found state component
 * @param domain The domain name (e.g., 'product', 'order', 'category')
 * @param backPath The path to navigate back to (e.g., '/products', '/orders')
 * @returns A React component for showing a not found state
 */
export function createNotFoundState(domain: string, backPath: string) {
  // Create a type for the props
  type NotFoundStateProps = {
    id?: string;
    error?: string;
  };

  // Create and return the component
  return function NotFoundStateComponent({ id, error }: NotFoundStateProps) {
    const router = useRouter();

    const handleBack = () => {
      router.push(backPath);
    };

    const domainCapitalized = domain.charAt(0).toUpperCase() + domain.slice(1);
    
    return (
      <EmptyState
        title={`${domainCapitalized} Not Found`}
        message={error || `Sorry, the ${domain.toLowerCase()}${id ? ` with ID ${id}` : ''} does not exist.`}
        actionButton={
          <BackButton onClick={handleBack}>
            Back to {domainCapitalized}s
          </BackButton>
        }
      />
    );
  };
}
