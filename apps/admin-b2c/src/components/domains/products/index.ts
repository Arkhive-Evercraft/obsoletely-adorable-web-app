// Export primary components for the products domain
export { ProductsTable } from './ProductsTable';
export { ProductDetail } from './ProductDetail';
export { ProductActions } from './ProductActions';

// Export state components
export { ProductLoadingState, ProductErrorState } from './ProductStates';

// Export product detail subcomponents
export {
    ProductDetailHeader, 
    ProductDescription, 
    ProductStory
} from "./ProductDetail/index"

// Re-exporting components as per the suggested changes
export { ProductMetadata } from './ProductDetail/ProductMetadata'; 
export * from './ProductDetail';
export * from './ProductStates';
