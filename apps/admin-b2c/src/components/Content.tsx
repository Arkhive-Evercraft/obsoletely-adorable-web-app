import type { PropsWithChildren } from "react";

interface ContentProps {
  className?: string;
}

export function Content({ children, className }: PropsWithChildren<ContentProps>) {
  return (
    <div className={`w-full h-full ${className || ''}`}>
      {children}
    </div>
  );
}