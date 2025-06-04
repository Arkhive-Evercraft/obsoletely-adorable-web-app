import { Hero } from "@/components/Layout/Hero"

export function Main({
  className,
}: {
  className?: string;
}) {
  return (
    <main className={className}>
      <Hero />
    </main>
  );
}
