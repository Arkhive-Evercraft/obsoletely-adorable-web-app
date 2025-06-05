import type { ReactNode } from "react";
import { Column } from "@/components/Layout";

interface MainProps {
  children?: React.ReactNode;
  className?: string;
  pageHeading: string;
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
  products?: any[]; // Add products prop for data passing
  categories?: any[]; // Add categories prop for data passing
}

export function Main({ 
  children, 
  className, 
  pageHeading, 
  leftColumn, 
  rightColumn, 
  products,
  categories 
}: MainProps) {
  return (
    <main className={`w-full h-full grid grid-cols-6 grid-rows-9 gap-4 p-4 ${className || ''}`}>
      <h2 className="col-span-6 row-span-1 text-2xl font-bold text-gray-800 py-4 px-4 border-b border-gray-200 w-full">
        {pageHeading}
      </h2>
      
      {/* Left Column */}
      <Column title="Products" className="col-span-4 row-span-8 row-start-2">
        {leftColumn || children}
        {products && (
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={index} className="p-2 border rounded">
                {typeof product === 'string' ? product : product.name || `Product ${index + 1}`}
              </div>
            ))}
          </div>
        )}
      </Column>

      {/* Right Column */}
      <Column title="Categories" className="col-span-2 row-span-8 row-start-2">
        {rightColumn}
        {categories && (
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="p-2 border rounded">
                {typeof category === 'string' ? category : category.name || `Category ${index + 1}`}
              </div>
            ))}
          </div>
        )}
      </Column>
    </main>
  );
}