import type { PropsWithChildren } from "react";

interface ColumnProps {
  className?: string;
  title?: string;
}

export function Column({ 
  children, 
  className = "",
  title
}: PropsWithChildren<ColumnProps>) {
  return (
    <div className={`${className} bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className} flex flex-col`}>
      {title && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="flex-1 overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
}