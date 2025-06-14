import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import { Header, Footer } from "@repo/ui/components";
import { Content } from "@repo/ui/components";
import { AuthWrapper } from "@/components/AuthWrapper";
import { UserActions } from "./UserActions";

interface AppLayoutProps {
    children?: ReactNode;
    requireAuth?: boolean;
}

export function AppLayout({
    children,
    requireAuth = true,
}: AppLayoutProps) {
    const navList = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/orders", label: "Orders" },
    ]
    return (
        <div className="h-screen flex flex-col gap-4 overflow-hidden">
            <MemoizedHeader 
                className="flex-shrink-0" 
                navItems={navList}
                renderUserActions={() => <UserActions />}
            />
            <Content className="flex-1 w-full overflow-auto">
                <AuthWrapper requireAuth={requireAuth}>
                    {children}
                </AuthWrapper>
            </Content>
            <MemoizedFooter className="flex-shrink-0" />
        </div>
    );
}

// Memoize the stable parts instead
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);