# Component Structure

This document outlines the component structure for the admin-b2c application.

## Overview

The component structure follows a modular approach with a clear separation of concerns:

- **UI Components**: Generic, reusable UI components
- **Domain Components**: Business domain-specific components 
- **Button Components**: Button variations and actions

## Directory Structure

```
components/
├── ui/                     # Generic UI components
│   ├── DataStates/         # Loading, Error, Empty states
│   ├── Actions/            # Action panels and UI controls
│
├── buttons/                # Button components
│   ├── base/               # Base button components
│   ├── actions/            # Action-specific buttons
│
├── domains/                # Domain-specific components
│   ├── products/           # Product components
│   ├── categories/         # Category components
│   ├── orders/             # Order components
│
├── legacy-*/               # Legacy components (to be migrated)
```

## UI Components

### DataStates

- `LoadingState`: Shows a loading spinner and message
- `ErrorState`: Shows an error message with optional retry button
- `EmptyState`: Shows an empty state with message and optional action button
- `createNotFoundState`: Utility to create domain-specific not found states

### Actions

- `ActionPanel`: A panel for organizing action buttons
- `SmartBackButton`: A smart back button that determines route based on current path

## Button Components

### Base Buttons

- `Button`: Core button component with styling variations
- `IconButton`: Button with icon support

### Action Buttons

- `EditSaveButton`: Toggle between Edit and Save modes
- `CancelButton`: Cancel action button
- `AddButton`: Add new item button
- `DeleteButton`: Delete item button
- `BackButton`: Navigation back button
- `ExportButtons`: Various export format buttons (CSV, JSON, PDF)

## Domain Components

Each domain has specialized components for states and actions:

### Products
- `ProductStates`: Loading and error states for products
- `ProductActions`: Action buttons for product operations
- `ProductsTable`: Table component for displaying products

### Categories
- `CategoryStates`: Loading and error states for categories
- `CategoryActions`: Action buttons for category operations
- `CategoriesTable`: Table component for displaying categories

### Orders
- `OrderStates`: Loading and error states for orders
- `OrderActions`: Action buttons for order operations
- `OrdersTable`: Table component for displaying orders

## Usage Guidelines

1. **For new code**: Import components from the new structure:
   ```typescript
   import { LoadingState, ErrorState } from '@/components/ui/DataStates';
   import { ActionPanel } from '@/components/ui/Actions';
   import { Button, IconButton } from '@/components/buttons/base';
   import { EditSaveButton, AddButton } from '@/components/buttons/actions/ActionButtons';
   ```

2. **For domain-specific components**: Import from the domain directory:
   ```typescript
   import { 
     ProductLoadingState, 
     ProductErrorState 
   } from '@/components/domains/products';
   ```

3. **Legacy imports**: The legacy components are still available, but will be removed in future:
   ```typescript
   import { LegacyProducts } from '@/components';
   ```

## Migration Progress

- ✅ UI Components: DataStates, Actions
- ✅ Button Components: Base, Actions
- ✅ Domain Components: Products, Categories, Orders
- ⏳ Pages: Some pages are still using legacy components
- ⏳ Legacy Components: Still need to be fully removed
