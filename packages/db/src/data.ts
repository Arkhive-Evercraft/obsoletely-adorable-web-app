export type Category = {
  name: string;
  description: string;
  imageUrl: string;
}

export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  categoryName: string;
  inventory: number; // Add inventory field
  createdAt: Date;
  updatedAt: Date;
}

// Order types - centralized definition
export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
}

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderDate: string;
  items: OrderItem[];
  shippingAddress: string;
}

// Database-related types that map to Prisma models
export type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Sale = {
  id: number;
  date: Date;
  total: number; // in cents
  customerId: number;
  customer?: Customer;
  items?: ProductSale[];
}

export type ProductSale = {
  saleId: number;
  itemId: number;
  quantity: number;
  priceAtSale: number; // in cents
  item?: Product;
}

export const categories: Category[] = [
  {
    name: "Electronics",
    description: "Electronic devices and accessories",
    imageUrl: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845"
  },
  {
    name: "Clothing",
    description: "Apparel and fashion items",
    imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5"
  },
  {
    name: "Home & Garden",
    description: "Items for your home and garden",
    imageUrl: "https://images.unsplash.com/photo-1501183638710-841dd1904471"
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: "Smartphone",
    price: 79999,
    description: "Latest smartphone with amazing features",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    categoryName: "Electronics",
    inventory: 50,
    createdAt: new Date('2025-05-15T10:30:00Z'),
    updatedAt: new Date('2025-06-01T14:20:00Z')
  },
  {
    id: 2,
    name: "Laptop",
    price: 129999,
    description: "Powerful laptop for work and gaming",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    categoryName: "Electronics",
    inventory: 30,
    createdAt: new Date('2025-05-10T09:15:00Z'),
    updatedAt: new Date('2025-05-28T16:45:00Z')
  },
  {
    id: 3,
    name: "T-shirt",
    price: 1999,
    description: "Comfortable cotton t-shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    categoryName: "Clothing",
    inventory: 100,
    createdAt: new Date('2025-04-20T11:00:00Z'),
    updatedAt: new Date('2025-05-30T13:30:00Z')
  },
  {
    id: 4,
    name: "Jeans",
    price: 4999,
    description: "Classic denim jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    categoryName: "Clothing",
    inventory: 80,
    createdAt: new Date('2025-04-25T15:45:00Z'),
    updatedAt: new Date('2025-06-02T10:15:00Z')
  },
  {
    id: 5,
    name: "Plant Pot",
    price: 1599,
    description: "Decorative pot for indoor plants",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
    categoryName: "Home & Garden",
    inventory: 70,
    createdAt: new Date('2025-05-05T08:20:00Z'),
    updatedAt: new Date('2025-05-25T12:10:00Z')
  },
  {
    id: 6,
    name: "Table Lamp",
    price: 2499,
    description: "Modern desk lamp with adjustable brightness",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    categoryName: "Home & Garden",
    inventory: 0,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  }
];
