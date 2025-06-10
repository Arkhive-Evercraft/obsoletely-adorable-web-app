import type { PropsWithChildren } from "react";
import React from "react";

interface ContentProps {
  className?: string;
}

// Memoize the Content component to prevent unnecessary re-renders
export const Content = React.memo(function Content({ 
  children, 
  className 
}: PropsWithChildren<ContentProps>) {
  return (
    <div className={className}>
      {children}
    </div>
  );
});