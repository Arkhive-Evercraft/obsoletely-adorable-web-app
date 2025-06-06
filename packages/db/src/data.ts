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
  inStock: boolean;
  featured: boolean;
  categoryName: string;
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
    inStock: true,
    featured: true,
    categoryName: "Electronics"
  },
  {
    id: 2,
    name: "Laptop",
    price: 129999,
    description: "Powerful laptop for work and gaming",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    inStock: true,
    featured: true,
    categoryName: "Electronics"
  },
  {
    id: 3,
    name: "T-shirt",
    price: 1999,
    description: "Comfortable cotton t-shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    inStock: true,
    featured: false,
    categoryName: "Clothing"
  },
  {
    id: 4,
    name: "Jeans",
    price: 4999,
    description: "Classic denim jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    inStock: true,    
    featured: false,
    categoryName: "Clothing"
  },
  {
    id: 5,
    name: "Plant Pot",
    price: 1599,
    description: "Decorative pot for indoor plants",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
    inStock: true,
    featured: false,
    categoryName: "Home & Garden"
  },
  {
    id: 6,
    name: "Table Lamp",
    price: 2499,
    description: "Modern desk lamp with adjustable brightness",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    inStock: false,
    featured: false,
    categoryName: "Home & Garden"
  }
];
