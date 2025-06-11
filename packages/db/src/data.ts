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
    name: "Animation",
    description: "",
    imageUrl: ""
  },
  {
    name: "Style",
    description: "",
    imageUrl: ""
  },
  {
    name: "Security",
    description: "",
    imageUrl: ""
  },
  {
    name: "Interactive",
    description: "",
    imageUrl: ""
  },
  {
    name: "Audio",
    description: "",
    imageUrl: ""
  },
];

export const products = [
  {
    id: 1,
    name: "<marquee>",
    price: 8.00, // Convert from cents to dollars for display
    description: "Restless gremlin.",
    story: "Constantly in motion, even when you're not looking.",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    categoryName: "Animation",
    inventory: 50,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  },
  {
    id: 2,
    name: "<blink>",
    price: 12.00,
    description: "Drama queen, starlet from the Netscape era.",
    story: "Sometimes visible. Sometimes not. Always fabulous.",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    categoryName: "Animation",
    inventory: 30,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  },
  {
    id: 3,
    name: "<center>",
    price: 10.00,
    description: "Middle child. Peacemaker. Slightly insecure.",
    story: "Can't stand being left-justified.",
    imageUrl: "s3://obsoletely-adorable-images/center-square-svgrepo-com.png",
    categoryName: "Style",
    inventory: 100,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  },
  {
    id: 4,
    name: "<applet>",
    price: 10.00,
    description: "Retired boomer who used to run Java applets at school",
    story: "Still thinks Java is cool (it kind of is).",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    categoryName: "Interactive",
    inventory: 80,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  },
  {
    id: 5,
    name: "<font>",
    price: 10.00,
    description: "Fashion-forward, extremely picky about looks.",
    story: "Changes style at every opportunity.",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
    categoryName: "Style",
    inventory: 70,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  },
  {
    id: 6,
    name: "<keygen>",
    price: 10.00,
    description: "Cryptic introvert. Might be in a hacker movie.",
    story: "Generates keys. Keeps secrets. Avoids eye contact.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    categoryName: "Security",
    inventory: 0,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  },
  {
    id: 7,
    name: "<bgsound>",
    price: 10.00,
    description: "Constantly playing music. No off switch.",
    story: "Autoplays MIDI files and refuses to apologize.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    categoryName: "Audio",
    inventory: 0,
    createdAt: new Date('2025-03-18T14:30:00Z'),
    updatedAt: new Date('2025-06-05T09:45:00Z')
  }
];