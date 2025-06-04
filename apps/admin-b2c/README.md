# Admin B2C Application

A Next.js-based admin interface for managing an e-commerce platform. This admin panel allows for product and category management with secure authentication.

## Overview

This admin application provides a user-friendly interface for e-commerce administrators to:

- Authenticate with secure password protection
- Manage product categories (create, view, update, delete)
- Manage products (create, view, update, delete)
- Toggle product availability (in-stock status)
- Seed the database with initial data

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **UI**: React with Tailwind CSS
- **Authentication**: JWT-based with HTTP-only cookies
- **Database**: Prisma ORM (via `@repo/db` package)
- **API**: Next.js API Routes (Route Handlers)

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm package manager
- Access to the monorepo root (for package dependencies)

### Environment Variables

Create a `.env.local` file in the admin-b2c directory with:

```
PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
```

Or use the environment variables from `@repo/env/admin`.

### Installation

From the monorepo root:

```bash
# Install all dependencies
pnpm install

# Generate Prisma client
pnpm -F @repo/db db:generate

# Push database schema
pnpm -F @repo/db db:push
```

### Running the Application

```bash
# From monorepo root
pnpm dev

# Or from the admin-b2c directory
pnpm dev
```

The application will be available at [http://localhost:3002](http://localhost:3002)

## Authentication

The admin app uses a simple password-based authentication system:

- **Login**: Enter the password defined in your environment variables
- **Session**: Authenticated via JWT stored in HTTP-only cookies
- **Logout**: Clears authentication cookies

All API routes that modify data require authentication.

## API Endpoints

### Authentication
- `POST /api/auth`: Login with password
- `DELETE /api/auth`: Logout

### Categories
- `GET /api/category`: List all categories
- `POST /api/category`: Create a new category
- `GET /api/category/[name]`: Get a specific category
- `PUT /api/category/[name]`: Update a category
- `DELETE /api/category/[name]`: Delete a category

### Products
- `GET /api/item`: List all products
- `POST /api/item`: Create a new product
- `GET /api/item/[id]`: Get a specific product
- `PUT /api/item/[id]`: Update a product
- `DELETE /api/item/[id]`: Delete a product
- `PATCH /api/item/[id]/stock`: Toggle a product's in-stock status

### Database
- `POST /api/seed`: Seed the database with initial data

## Application Structure

```
admin-b2c/
├── api/                # API Route Handlers
│   ├── auth/           # Authentication endpoints
│   ├── category/       # Category management endpoints
│   ├── item/           # Product management endpoints
│   └── seed/           # Database seeding endpoint
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   │   ├── Catalogue/  # Product/category management components
│   │   └── Layout/     # Layout components
│   └── utils/          # Utility functions
└── tests/              # Test files
```

## Database Integration

This app uses the `@repo/db` package to interact with the database:

- **Client**: Imported from `@repo/db/client`
- **Utility Functions**: Imported from `@repo/db/utils`
- **Seed Data**: Imported from `@repo/db/seed`

Example usage in API routes:

```typescript
import { getProducts, createProduct } from "@repo/db/utils";

// GET handler to list all products
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
```

## Component Structure

The admin interface includes several key components:

- **Login Form**: Authentication interface
- **Navigation**: Main app navigation
- **Category Manager**: Interface for managing categories
- **Product Manager**: Interface for managing products
- **Forms**: Create/edit forms for products and categories

## Security

The admin app implements several security measures:

- Password-protected access
- JWT authentication with HTTP-only cookies
- Server-side authentication checks
- Input validation on all form submissions

## Development

### Adding New Features

1. Create or modify API endpoints in the `/api` directory
2. Update UI components in `/src/components`
3. Add any necessary utility functions in `/src/utils`

### Running Tests

```bash
pnpm test
```

## Troubleshooting

### Common Issues

- **Authentication Errors**: Check your `.env.local` file for correct PASSWORD and JWT_SECRET
- **Database Errors**: Ensure Prisma client is generated and schema is pushed
- **API Errors**: Check server logs for detailed error messages

## License

This project is part of COMP3036 Major Assignment and is subject to university guidelines.