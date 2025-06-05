import type { PropsWithChildren, ReactNode } from "react";
import { Header, Footer } from "@/components/Layout";
import { Content } from "@/components/Content";

interface AppLayoutProps {
    children?: ReactNode;
    query?: string;
}

export function AppLayout({
    children,
    query,
}: AppLayoutProps) {
    return (
        <div className="grid grid-cols-5 grid-rows-11 gap-4" style={{ height: '95vh' }}>
            <Header className="col-span-5 row-span-1 flex flex-col"/>
            <Content className="col-span-5 row-span-9 row-start-2">
                {children}
            </Content>
            <Footer className="col-span-5 col-start-1 row-start-11" />
        </div>
    );
}