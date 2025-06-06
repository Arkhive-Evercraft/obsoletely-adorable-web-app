import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import { Header, Footer } from "@/components/Layout";
import { Content } from "@/components/Content";
import { AuthWrapper } from "@/components/AuthWrapper";

interface AppLayoutProps {
    children?: ReactNode;
    query?: string;
}

// Remove memo from AppLayout since children always change
export function AppLayout({
    children,
    query,
}: AppLayoutProps) {
    return (
        <AuthWrapper>
            <div className="grid grid-cols-5 grid-rows-11 gap-4" style={{ height: '95vh' }}>
                <MemoizedHeader className="col-span-5 row-span-1 flex flex-col"/>
                <Content className="col-span-5 row-span-9 row-start-2">
                    {children}
                </Content>
                <MemoizedFooter className="col-span-5 col-start-1 row-start-11" />
            </div>
        </AuthWrapper>
    );
}

// Memoize the stable parts instead
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);