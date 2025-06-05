interface MainProps {
  children?: React.ReactNode;
  className?: string;
}

export function Main({ children, className }: MainProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}