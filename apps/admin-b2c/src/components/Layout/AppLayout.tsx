import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import { Header, Footer } from "@repo/ui/components";
import { Content } from "@repo/ui/components";
import { AuthWrapper } from "@/components/AuthWrapper";

interface AppLayoutProps {
    children?: ReactNode;
    query?: string;
}

export function AppLayout({
    children,
    query,
}: AppLayoutProps) {
    const navList = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/orders", label: "Orders" },
        { href: "/settings", label: "Settings" },
    ]
    return (
        <AuthWrapper>
            <div className="h-screen flex flex-col gap-4 overflow-hidden">
                <MemoizedHeader className="flex-shrink-0" navItems={navList}/>
                <Content className="flex-1 w-full overflow-auto">
                    {children}
                </Content>
                <MemoizedFooter className="flex-shrink-0" />
            </div>
        </AuthWrapper>
    );
}

// Memoize the stable parts instead
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);