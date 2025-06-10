# COMP3036 Major Assignment

A full-stack e-commerce application with admin and user interfaces built using Next.js and Prisma.

## Project Structure

This project follows a monorepo architecture using Turborepo. It consists of:

- **Apps**:
  - `admin-b2c`: Admin interface for managing products and categories
  - `user-b2c`: User-facing e-commerce application

- **Packages**:
  - `db`: Database client, schema, and utility functions
  - `env`: Environment variable configurations
  - `ui`: Shared UI components
  - `utils`: Shared utility functions
  - `eslint-config`, `tsconfig`, etc.: Shared configuration packages

## Database Structure

The application uses Prisma with SQLite as its database. The schema includes:

### Models

- **Category**: Represents product categories
  - `name`: String (ID)
  - `description`: String
  - `imageUrl`: String
  - Relation: One-to-many with Product

- **Product**: Represents products for sale
  - `id`: Int (ID)
  - `name`: String
  - `price`: Int (stored in cents)
  - `description`: String
  - `imageUrl`: String
  - `categoryName`: String (Foreign key to Category)
  - `inStock`: Boolean
  - `featured`: Boolean
  - Relations: Many-to-one with Category, One-to-many with ProductSale

- **Sale**: Represents a completed sale/order
  - `id`: Int (ID)
  - `date`: DateTime
  - `total`: Int (stored in cents)
  - Relation: One-to-many with ProductSale

- **ProductSale**: Junction table for Sale and Product (many-to-many)
  - Composite ID: `[saleId, itemId]`
  - `quantity`: Int
  - `priceAtSale`: Int (stores price at time of sale in cents)
  - Relations: Many-to-one with both Sale and Product

## Admin API Functionality

The admin application provides RESTful API endpoints for managing the e-commerce platform:

### Authentication (`/api/auth`)

- **POST**: Authenticates admin users with password-based login
  - Sets JWT token in an HTTP-only cookie
- **DELETE**: Logs out users by removing the auth cookie

### Categories (`/api/category`)

- **GET**: Retrieves all categories
- **POST**: Creates a new category (requires authentication)
  - Required fields: `name`
  - Optional fields: `description`, `imageUrl`

### Products (`/api/item`)

- **GET**: Retrieves all products
- **POST**: Creates a new product (requires authentication)
  - Required fields: `name`, `price`, `imageUrl`, `categoryName`
  - Optional fields: `description`, `inStock`, `featured`

### Individual Category Management (`/api/category/[name]`)

- **GET**: Retrieves a specific category by name
- **PUT**: Updates a category's details (requires authentication)
- **DELETE**: Deletes a category (requires authentication)
  - Cannot delete categories with associated products

### Individual Product Management (`/api/item/[id]`)

- **GET**: Retrieves a specific product by ID
- **PUT**: Updates a product's details (requires authentication)
- **DELETE**: Deletes a product (requires authentication)

### Database Seeding (`/api/seed`)

- **POST**: Seeds the database with initial categories and products (requires authentication)

## Database Package Structure

The `@repo/db` package provides database functionality to both the admin and user applications:

### Core Components:

1. **Client** (`src/client.ts`):
   - Exports a PrismaClient instance for database access
   - Uses singleton pattern to prevent multiple connections
   - References environment variables from `@repo/env`

2. **Data** (`src/data.ts`):
   - Defines types and sample data for seeding
   - Exports `Category` and `Product` types
   - Contains arrays of sample categories and products

3. **Seed** (`src/seed.ts`):
   - Provides functionality to seed the database with initial data
   - Clears existing data before adding new entries
   - Can be run directly or through the API

4. **Utility Functions** (`utils/functions.ts`):
   - CRUD operations for all database models
   - Business logic for data operations
   - Input validation and error handling

### Package Exports and Aliases

The `@repo/db` package exports its functionality through specific paths, defined in its `package.json`:

```javascript
"exports": {
  "./client": {
    "types": "./src/client.ts",
    "default": "./dist/client.js"
  },
  "./data": {
    "types": "./src/data.ts",
    "default": "./dist/data.js"
  },
  "./seed": {
    "types": "./src/seed.ts",
    "default": "./dist/seed.js"
  },
  "./utils": {
    "types": "./utils/functions.ts",
    "default": "./dist/functions.js"
  }
}
```

These can be imported using the following aliases:

- `@repo/db/client`: Database client
- `@repo/db/data`: Data types and sample data
- `@repo/db/seed`: Database seeding functionality
- `@repo/db/utils`: Database utility functions

## Separation of Concerns

This project implements separation of concerns through:

1. **Monorepo Structure**:
   - Shared code is extracted into packages
   - Apps only contain application-specific code
   - Configuration is centralized and shared

2. **Database Access**:
   - Direct database access is encapsulated in the `db` package
   - API routes never directly use Prisma client
   - All database operations go through utility functions

3. **API Layer**:
   - API routes handle HTTP concerns (request parsing, response formatting)
   - Authentication logic is separated into utility functions
   - Business logic is delegated to the database package

4. **Environment Variables**:
   - Managed through a dedicated `env` package
   - Different environments for admin and web applications
   - Type-safe access to environment variables

## Development

### Prerequisites

- Node.js (v18+)
- pnpm

### Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables (see `.env.example` files)
4. Generate Prisma client: `pnpm -F @repo/db db:generate`
5. Push database schema: `pnpm -F @repo/db db:push`
6. Seed the database: `pnpm -F @repo/db db:seed`
7. Start development server: `pnpm dev`

## Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm lint`: Run ESLint on all packages
- `pnpm -F @repo/db db:seed`: Seed the database
- `pnpm -F @repo/db studio`: Open Prisma Studio to view/edit database

## Contributing

When adding new features:

1. Update database schema if necessary
2. Add utility functions in the `db` package
3. Create or update API endpoints in the relevant app
4. Update UI to use the new functionality