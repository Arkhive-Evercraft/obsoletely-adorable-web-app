import { Post } from "@repo/db/data";

export function Main({
  className,
}: {
  className?: string;
}) {
  return (
    <main className={className}>
        <p>Hi :)</p>
    </main>
  );
}
