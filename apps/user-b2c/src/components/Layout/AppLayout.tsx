import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import { Header, Footer } from "@repo/ui/components";
import { Content } from "@repo/ui/components";
import { AuthWrapper } from "@/components/AuthWrapper";
import { UserActions } from "./UserActions";

interface AppLayoutProps {
    children?: ReactNode;
    query?: string;
    requireAuth?: boolean;
}

// Remove memo from AppLayout since children always change
export function AppLayout({
    children,
    query,
    requireAuth = true,
}: AppLayoutProps) {
    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/products", label: "Products" },
        { href: "/categories", label: "Categories" },
        { href: "/checkout", label: "Checkout" },
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