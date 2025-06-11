// Export primary components for the products domain
export { ProductsTable } from './ProductsTable';
export { ProductDetail } from './ProductDetail';
export { ProductActions } from './ProductActions';

// Export state components
export { ProductLoadingState, ProductErrorState } from './ProductStates';

// Export product detail subcomponents
export { 
  ProductDetailHeader,
  ProductMetadata as ProductMetaGrid,
  ProductDescription,
  ProductStory,
  NewProductActionsPanel
} from './ProductDetail';
