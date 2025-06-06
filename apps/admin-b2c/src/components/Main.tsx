import type { ReactNode } from "react";
import React from "react";
import { Column } from "@/components/Layout";

interface MainProps {
  children?: React.ReactNode;
  className?: string;
  pageHeading: string;
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
  leftColumnTitle?: string;
  rightColumnTitle?: string;
}

export const Main = React.memo(function Main({ 
  children, 
  className, 
  pageHeading, 
  leftColumn, 
  rightColumn, 
  leftColumnTitle = "",
  rightColumnTitle = ""
}: MainProps) {
  return (
    <main className={`w-full h-full grid grid-cols-4 grid-rows-9 gap-4 p-4 ${className || ''}`}>
      <h2 className="col-span-6 row-span-1 text-2xl font-bold text-gray-800 py-4 px-4 border-b border-gray-200 w-full">
        {pageHeading}
      </h2>
      
      {/* Left Column */}
      <Column title={leftColumnTitle} className="col-span-3 row-span-8 row-start-2">
        {leftColumn || children}
      </Column>

      {/* Right Column */}
      <Column title={rightColumnTitle} className="col-span-1 row-span-8 row-start-2">
        {rightColumn}
      </Column>
    </main>
  );
});