import type { PropsWithChildren } from "react";
import { Content } from "../Content";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <>
      <div className="grid grid-cols-12 grid-rows-6 h-screen">
        <div className="col-span-9 row-span-5">
          <Content>
            {children}
          </Content>
        </div>
      </div>
    </>
  );
}
