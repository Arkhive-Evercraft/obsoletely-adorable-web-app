import type { PropsWithChildren } from "react";

interface ContentProps {
  className?: string;
}

export function Content({ children, className }: PropsWithChildren<ContentProps>) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}