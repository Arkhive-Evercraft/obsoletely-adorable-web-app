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

// Remove memo from AppLayout since children always change
export function AppLayout({
    children,
    requireAuth = true,
}: AppLayoutProps) {
    const navList = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/products", label: "Products" },
        { href: "/checkout", label: "Checkout" },
    ]
    return (
        <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden box-border bg-gradient-to-br from-blue-50/30 via-emerald-50/30 to-amber-50/30">
            <MemoizedHeader 
                className="flex-shrink-0 retro-window w-full" 
                navItems={navList}
                renderUserActions={() => <UserActions />}
            />
            <Content className="flex-1 w-full max-w-full overflow-auto px-4 py-2">
                <AuthWrapper requireAuth={requireAuth}>
                    {children}
                </AuthWrapper>
            </Content>
            <MemoizedFooter className="flex-shrink-0 retro-panel w-full" />
        </div>
    );
}

// Memoize the stable parts instead
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);