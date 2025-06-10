import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import { Header, Footer } from "@repo/ui/components";
import { Content } from "@repo/ui/components";

interface AppLayoutProps {
    children?: ReactNode;
}

// Remove memo from AppLayout since children always change
export function AppLayout({
    children,
}: AppLayoutProps) {
    return (
        <div className="h-screen flex flex-col gap-4 overflow-hidden">
            <MemoizedHeader className="flex-shrink-0"/>
            <Content className="flex-1 w-full overflow-auto">
                {children}
            </Content>
            <MemoizedFooter className="flex-shrink-0" />
        </div>
    );
}

// Memoize the stable parts instead
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);