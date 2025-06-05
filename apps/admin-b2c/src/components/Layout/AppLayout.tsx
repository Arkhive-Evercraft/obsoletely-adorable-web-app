import type { PropsWithChildren } from "react";
import { Header, Column, Footer } from "@/components/Layout";
import { Table } from "@repo/ui";

export function AppLayout({
    children,
    query,
    pageHeading = "Dashboard",
}: PropsWithChildren<{ query?: string; pageHeading?: string }>) {
    return (
        <div className="grid grid-cols-3 grid-rows-5 gap-8" style={{ height: '95vh' }}>
            <div className="col-span-3 row-span-1 flex flex-col">
                <Header />
                <div className="flex-1 flex items-end">
                    <h2 className="text-2xl font-bold text-gray-800 py-4 px-4 border-b border-gray-200 w-full">
                        {pageHeading}
                    </h2>
                </div>
            </div>
            {/* Left Column */}
            <Column title="CONTENT" className="col-span-2 row-span-3 row-start-2">
                {children}
            </Column>

            {/* Right Column */}
            <Column title="CONTENT" className="col-span-1 row-span-3 row-start-2">
                {children}
            </Column>

            <Footer className="col-span-3 col-start-1 row-start-5"/>
        </div>
    );
}