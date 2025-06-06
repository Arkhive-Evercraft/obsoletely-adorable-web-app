import { client } from "@repo/db/client"
import { Product, Category, Sale, ProductSale } from "@prisma/client";

// Get all products from the database
export async function getProducts(): Promise<Product[]> {
    try {
      const products = await client.db.product.findMany({
        include: {
          category: true, // Use lowercase 'category' to match the Prisma schema
        },
      });
      
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
}

// Get a single product by ID
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const product = await client.db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    
    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

// Create a new product
export async function createProduct(data: {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  inStock?: boolean;
  featured?: boolean;
  inventory: number;
}): Promise<Product | null> {
  try {
    const product = await client.db.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        categoryName: data.categoryName,
        inventory: data.inventory ?? 0,
        featured: data.featured ?? false
      }
    });
    
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
}

// Update a product
export async function updateProduct(
  id: number,
  data: Partial<{
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    categoryName: string;
    inStock: boolean;
    featured: boolean;
  }>
): Promise<Product | null> {
  try {
    const product = await client.db.product.update({
      where: { id },
      data
    });
    
    return product;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return null;
  }
}

// Delete a product
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await client.db.product.delete({
      where: { id }
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return false;
  }
}

// Get all products in a specific category
export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  try {
    const products = await client.db.product.findMany({
      where: {
        categoryName: categoryName,
      },
      include: {
        category: true,
      },
    });
    
    return products;
  } catch (error) {
    console.error(`Error fetching products in category ${categoryName}:`, error);
    return [];
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await client.db.category.findMany({
      include: {
        items: true, // This includes all products in each category
      },
    });
    
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Get a category by name
export async function getCategoryByName(name: string): Promise<Category | null> {
  try {
    const category = await client.db.category.findUnique({
      where: { name },
      include: {
        items: true,
      },
    });
    
    return category;
  } catch (error) {
    console.error(`Error fetching category ${name}:`, error);
    return null;
  }
}

// Create a new category
export async function createCategory(data: {
  name: string;
  description: string;
  imageUrl: string;
}): Promise<Category | null> {
  try {
    const category = await client.db.category.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl
      }
    });
    
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

// Update a category
export async function updateCategory(
  name: string,
  data: Partial<{
    description: string;
    imageUrl: string;
  }>
): Promise<Category | null> {
  try {
    const category = await client.db.category.update({
      where: { name },
      data
    });
    
    return category;
  } catch (error) {
    console.error(`Error updating category with name ${name}:`, error);
    return null;
  }
}

// Delete a category
export async function deleteCategory(name: string): Promise<boolean> {
  try {
    // Check if the category has associated products by querying products directly
    const productsInCategory = await client.db.product.findMany({
      where: { categoryName: name },
      take: 1, // We only need to know if at least one product exists
    });
    
    if (productsInCategory.length > 0) {
      throw new Error("Cannot delete category with associated products");
    }
    
    await client.db.category.delete({
      where: { name }
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting category with name ${name}:`, error);
    return false;
  }
}
