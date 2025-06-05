import type { PropsWithChildren, ReactNode } from "react";
import { Header, Column, Footer } from "@/components/Layout";
import { Table } from "@repo/ui";

interface AppLayoutProps {
    children?: ReactNode;
    leftColumn?: ReactNode;
    rightColumn?: ReactNode;
    query?: string;
    pageHeading?: string;
}

export function AppLayout({
    children,
    leftColumn,
    rightColumn,
    query,
    pageHeading = "Dashboard",
}: AppLayoutProps) {
    return (
        <div className="grid grid-cols-3 grid-rows-11 gap-4" style={{ height: '95vh' }}>
            <div className="col-span-3 row-span-1 flex flex-col">
                <Header />
            </div>
            <h2 className="col-span-3 row-span-1 row-start-2 text-2xl font-bold text-gray-800 py-4 px-4 border-b border-gray-200 w-full">
                        {pageHeading}
                    </h2>
            {/* Left Column */}
            <Column title="Products" className="col-span-2 row-span-8 row-start-3">
                {leftColumn || children}
            </Column>

            {/* Right Column */}
            <Column title="Categories" className="col-span-1 row-span-8 row-start-3">
                {rightColumn}
            </Column>

            <Footer className="col-span-3 col-start-1 row-start-11"/>
        </div>
    );
}