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
  story?: string;
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
  customer: Customer;
  items: ProductSale[];
}

export type ProductSale = {
  saleId: number;
  itemId: number;
  quantity: number;
  price: number; // in cents
  item: Product;
}

export const categories: Category[] = [
  {
    name: "Tag",
    description: "Building blocks of the internet.",
    imageUrl: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845"
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: "<marquee>",
    price: 1000,
    description: "Restless gremlin.",
    story: "Constantly in motion, even when you're not looking.",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    categoryName: "Tag",
    inventory: 50,
    createdAt: new Date('2025-05-15T10:30:00Z'),
    updatedAt: new Date('2025-06-01T14:20:00Z')
  },
  {
    id: 2,
    name: "<blink>",
    price: 1000,
    description: "Drama queen, starlet from the Netscape era.",
    story: "Sometimes visible. Sometimes not. Always fabulous.",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    categoryName: "Tag",
    inventory: 30,
    createdAt: new Date('2025-05-10T09:15:00Z'),
    updatedAt: new Date('2025-05-28T16:45:00Z')
  },
  {
    id: 3,
    name: "<center>",
    price: 1000,
    description: "Middle child. Peacemaker. Slightly insecure.",
    story: "Can't stand being left-justified.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    categoryName: "Tag",
    inventory: 100,
    createdAt: new Date('2025-04-20T11:00:00Z'),
    updatedAt: new Date('2025-05-30T13:30:00Z')
  },
  {
    id: 4,
    name: "<applet>",
    price: 1000,
    description: "Retired boomer who used to run Java applets at school",
    story: "Still thinks Java is cool (it kind of is).",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    categoryName: "Tag",
    inventory: 80,
    createdAt: new Date('2025-04-25T15:45:00Z'),
    updatedAt: new Date('2025-06-02T10:15:00Z')
  },
  {
    id: 5,
    name: "<font>",
    price: 1000,
    description: "Fashion-forward, extremely picky about looks.",
    story: "Changes style at every opportunity.",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
    categoryName: "Tag",
    inventory: 70,
    createdAt: new Date('2025-05-05T08:20:00Z'),
    updatedAt: new Date('2025-05-25T12:10:00Z')
  },
  {
    id: 6,
    name: "<keygen>",
    price: 1000,
    description: "Cryptic introvert. Might be in a hacker movie.",
    story: "Generates keys. Keeps secrets. Avoids eye contact.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    categoryName: "Tag",
    inventory: 0,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  },
  {
    id: 7,
    name: "<bgsound>",
    price: 1000,
    description: "Constantly playing music. No off switch.",
    story: "Autoplays MIDI files and refuses to apologize.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    categoryName: "Tag",
    inventory: 0,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  }
];
