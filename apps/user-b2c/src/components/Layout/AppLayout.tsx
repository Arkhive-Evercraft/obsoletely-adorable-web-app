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
        { href: "/products", label: "Tags" },
        { href: "/categories", label: "Categories" },
        { href: "/checkout", label: "Adopt" },
    ]
    return (
        <div className="h-screen flex flex-col gap-4 overflow-hidden bg-gradient-to-br from-vapor-pink/5 via-vapor-purple/5 to-vapor-cyan/5">
            <MemoizedHeader 
                className="flex-shrink-0 retro-window" 
                navItems={navList}
                renderUserActions={() => <UserActions />}
            />
            <Content className="flex-1 w-full overflow-auto">
                <AuthWrapper requireAuth={requireAuth}>
                    {children}
                </AuthWrapper>
            </Content>
            <MemoizedFooter className="flex-shrink-0 retro-panel" />
        </div>
    );
}

// Memoize the stable parts instead
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);