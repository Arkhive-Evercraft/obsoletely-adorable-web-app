/**
 * Component Exports
 * 
 * This file is the main entry point for all component exports.
 * Components are now organized in a modular architecture.
 * 
 * IMPORTANT:
 * - Use imports from './ui' for UI components
 * - Use imports from './domains' for domain-specific components
 */

// Primary exports - use these for all code
export * from './ui';
export * from './domains';

// Layout components
export { AppLayout } from './Layout/AppLayout';
export { Main } from './Main';

// Providers and wrappers
export { AppDataProvider } from './AppDataProvider';
export { AuthWrapper } from './AuthWrapper';

// Re-export Layout for backward compatibility
import * as LegacyLayout from './Layout';
export { LegacyLayout };

// Re-export legacy-buttons for backward compatibility
import * as LegacyButtons from './legacy-buttons';
export { LegacyButtons };
