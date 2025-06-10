import { client } from "@repo/db/client";
import { Product, Category, Sale, ProductSale, Customer, CartReservation, Prisma } from "@prisma/client";
import { Order } from '@repo/db/data'

// Type for cart reservation with product relation
type CartReservationWithProduct = Prisma.CartReservationGetPayload<{
  include: { product: true }
}>

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
  story: string;
  imageUrl: string;
  categoryName: string;
  inventory: number;
}): Promise<Product | null> {
  try {
    const product = await client.db.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        story: data.story,
        imageUrl: data.imageUrl,
        categoryName: data.categoryName,
        inventory: data.inventory ?? 0,
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
    story: string;
    imageUrl: string;
    categoryName: string;
    inventory: number;
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
  currentName: string,
  data: Partial<{
    name: string;
    description: string;
    imageUrl: string;
  }>
): Promise<Category | null> {
  try {
    const category = await client.db.category.update({
      where: { name: currentName },
      data
    });
    
    return category;
  } catch (error) {
    console.error(`Error updating category with name ${currentName}:`, error);
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

// Get all sales with customer and product details
export async function getSales(): Promise<Sale[]> {
  try {
    const sales = await client.db.sale.findMany({
      include: {
        customer: true,
        items: {
          include: {
            item: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return sales;
  } catch (error) {
    console.error("Error fetching sales:", error);
    return [];
  }
}

// Get a single sale by ID
export async function getSaleById(id: number): Promise<Sale | null> {
  try {
    const sale = await client.db.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            item: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
    
    return sale;
  } catch (error) {
    console.error(`Error fetching sale with ID ${id}:`, error);
    return null;
  }
}

// Create a new sale
export async function createSale(data: {
  customerId: number;
  total: number;
  items: {
    itemId: number;
    quantity: number;
    price: number;
  }[];
}): Promise<Sale | null> {
  try {
    // Use a transaction to ensure both sale creation and inventory updates succeed or fail together
    const sale = await client.db.$transaction(async (tx) => {
      // Create the sale first
      const newSale = await tx.sale.create({
        data: {
          customerId: data.customerId,
          total: data.total,
          date: new Date(),
          items: {
            create: data.items.map(item => ({
              itemId: item.itemId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          customer: true,
          items: {
            include: {
              item: true
            }
          }
        }
      });
      
      // Update inventory for each product
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.itemId }
        });
        
        if (product) {
          // Calculate new inventory level (ensure it doesn't go below 0)
          const newInventory = Math.max(0, product.inventory - item.quantity);
          
          // Update the product's inventory
          await tx.product.update({
            where: { id: item.itemId },
            data: { inventory: newInventory }
          });
        }
      }
      
      return newSale;
    });
    
    return sale;
  } catch (error) {
    console.error("Error creating sale:", error);
    return null;
  }
}

// Customer related functions

// Get a customer by email
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const customer = await client.db.customer.findUnique({
      where: { email },
    });
    
    return customer;
  } catch (error) {
    console.error(`Error fetching customer with email ${email}:`, error);
    return null;
  }
}

// Create a new customer
export async function createCustomer(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}): Promise<Customer | null> {
  try {
    const customer = await client.db.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      }
    });
    
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
}

// Update a customer
export async function updateCustomer(
  email: string,
  data: Partial<{
    name: string;
    phone: string;
    address: string;
  }>
): Promise<Customer | null> {
  try {
    const customer = await client.db.customer.update({
      where: { email },
      data
    });
    
    return customer;
  } catch (error) {
    console.error(`Error updating customer with email ${email}:`, error);
    return null;
  }
}

// Get all customers
export async function getCustomers(): Promise<Customer[]> {
  try {
    const customers = await client.db.customer.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

// Get sales for a specific customer by email
export async function getSalesByCustomerEmail(email: string): Promise<Sale[]> {
  try {
    const sales = await client.db.sale.findMany({
      where: {
        customer: {
          email: email
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            item: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return sales;
  } catch (error) {
    console.error(`Error fetching sales for customer with email ${email}:`, error);
    return [];
  }
}

// Update inventory for products after a sale
export async function updateInventoryAfterSale(items: { itemId: number; quantity: number }[]): Promise<boolean> {
  try {
    // Use a transaction to ensure all inventory updates are atomic
    await client.db.$transaction(async (tx) => {
      for (const item of items) {
        // Get current product
        const product = await tx.product.findUnique({
          where: { id: item.itemId }
        });
        
        if (!product) {
          throw new Error(`Product with ID ${item.itemId} not found`);
        }
        
        // Calculate new inventory level (ensure it doesn't go below 0)
        const newInventory = Math.max(0, product.inventory - item.quantity);
        
        // Update the product's inventory
        await tx.product.update({
          where: { id: item.itemId },
          data: { inventory: newInventory }
        });
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error updating inventory after sale:', error);
    return false;
  }
}

// Cart Reservation Functions - Note: These will be available after schema migration
// Comment out until Prisma migrations are run

// Create a new cart reservation
export async function createCartReservation(data: {
  productId: number;
  quantity: number;
  sessionId: string;
  expiryWeeks?: number;
}): Promise<boolean> {
  try {
    // Default expiry time is 1 week (7 days)
    const expiryWeeks = data.expiryWeeks || 1;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiryWeeks * 7));
    
    // Check available inventory (physical inventory minus active reservations)
    const availableInventory = await getAvailableInventory(data.productId);
    
    if (availableInventory < data.quantity) {
      return false;
    }
    
    // Check if there's already a reservation for this product in this session
    const existingReservation = await client.db.cartReservation.findFirst({
      where: {
        productId: data.productId,
        sessionId: data.sessionId,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    
    if (existingReservation) {
      // Update existing reservation
      await client.db.cartReservation.update({
        where: { id: existingReservation.id },
        data: {
          quantity: data.quantity,
          expiresAt: expiresAt
        }
      });
    } else {
      // Create new reservation
      await client.db.cartReservation.create({
        data: {
          productId: data.productId,
          quantity: data.quantity,
          sessionId: data.sessionId,
          expiresAt: expiresAt
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating cart reservation:', error);
    return false;
  }
}

// Get all active reservations for a session
export async function getSessionReservations(sessionId: string): Promise<CartReservationWithProduct[]> {
  try {
    const reservations = await client.db.cartReservation.findMany({
      where: {
        sessionId: sessionId,
        expiresAt: {
          gt: new Date() // Only return non-expired reservations
        }
      },
      include: {
        product: true
      }
    });
    
    return reservations;
  } catch (error) {
    console.error('Error fetching session reservations:', error);
    return [];
  }
}

// Remove a specific reservation
export async function removeCartReservation(productId: number, sessionId: string): Promise<boolean> {
  try {
    await client.db.cartReservation.deleteMany({
      where: {
        productId: productId,
        sessionId: sessionId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error removing cart reservation:', error);
    return false;
  }
}

// Clear all reservations for a session
export async function clearSessionReservations(sessionId: string): Promise<boolean> {
  try {
    await client.db.cartReservation.deleteMany({
      where: {
        sessionId: sessionId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing session reservations:', error);
    return false;
  }
}

// Clean up expired reservations (run this periodically)
export async function cleanupExpiredReservations(): Promise<number> {
  try {
    const result = await client.db.cartReservation.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    return result.count;
  } catch (error) {
    console.error('Error cleaning up expired reservations:', error);
    return 0;
  }
}

// Get real-time available inventory (physical inventory minus active reservations)
export async function getAvailableInventory(productId: number): Promise<number> {
  try {
    const product = await client.db.product.findUnique({
      where: { id: productId },
      include: {
        reservations: true
      }
    });
    
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    // Calculate total reserved quantity from non-expired reservations
    const reservedQuantity = product.reservations.reduce((total, res) => {
      if (res.expiresAt > new Date()) {
        return total + res.quantity;
      }
      return total;
    }, 0);
    
    return Math.max(0, product.inventory - reservedQuantity);
  } catch (error) {
    console.error(`Error calculating available inventory for product ${productId}:`, error);
    return 0;
  }
}

// User-based Cart Functions

// Create or update cart reservation with user ID
export async function createUserCartReservation(data: {
  productId: number;
  quantity: number;
  sessionId: string;
  userId: string;
  expiryWeeks?: number;
}): Promise<boolean> {
  try {
    // Default expiry time is 1 week (7 days)
    const expiryWeeks = data.expiryWeeks || 1;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiryWeeks * 7));
    
    // Check available inventory (physical inventory minus active reservations)
    const availableInventory = await getAvailableInventory(data.productId);
    
    if (availableInventory < data.quantity) {
      return false;
    }
    
    // Check if there's already a reservation for this product for this user
    const existingReservation = await client.db.cartReservation.findFirst({
      where: {
        productId: data.productId,
        userId: data.userId,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    
    if (existingReservation) {
      // Update existing reservation
      await client.db.cartReservation.update({
        where: { id: existingReservation.id },
        data: {
          quantity: data.quantity,
          expiresAt: expiresAt,
          sessionId: data.sessionId, // Update sessionId to current session
        }
      });
    } else {
      // Create new reservation
      await client.db.cartReservation.create({
        data: {
          productId: data.productId,
          quantity: data.quantity,
          sessionId: data.sessionId,
          userId: data.userId,
          expiresAt: expiresAt
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating user cart reservation:', error);
    return false;
  }
}

// Get all active reservations for a user
export async function getUserReservations(userId: string): Promise<CartReservationWithProduct[]> {
  try {
    const reservations = await client.db.cartReservation.findMany({
      where: {
        userId: userId,
        expiresAt: {
          gt: new Date() // Only return non-expired reservations
        }
      },
      include: {
        product: true
      }
    });
    
    return reservations;
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    return [];
  }
}

// Transfer session-based cart to user account (when user logs in)
export async function transferSessionCartToUser(sessionId: string, userId: string): Promise<boolean> {
  try {
    // Get all active session reservations
    const sessionReservations = await getSessionReservations(sessionId);
    
    if (sessionReservations.length === 0) {
      return true; // Nothing to transfer
    }
    
    // Get existing user reservations
    const userReservations = await getUserReservations(userId);
    const userReservationMap = new Map(
      userReservations.map(res => [res.productId, res])
    );
    
    // Process each session reservation
    for (const sessionRes of sessionReservations) {
      const existingUserRes = userReservationMap.get(sessionRes.productId);
      
      if (existingUserRes) {
        // User already has this item, combine quantities
        const newQuantity = existingUserRes.quantity + sessionRes.quantity;
        
        // Check if combined quantity is available
        const availableInventory = await getAvailableInventory(sessionRes.productId);
        const actualQuantity = Math.min(newQuantity, availableInventory);
        
        await client.db.cartReservation.update({
          where: { id: existingUserRes.id },
          data: {
            quantity: actualQuantity,
            sessionId: sessionId, // Update to current session
            expiresAt: sessionRes.expiresAt // Keep the longer expiry
          }
        });
        
        // Remove the session reservation
        await client.db.cartReservation.delete({
          where: { id: sessionRes.id }
        });
      } else {
        // Transfer session reservation to user
        await client.db.cartReservation.update({
          where: { id: sessionRes.id },
          data: {
            userId: userId
          }
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error transferring session cart to user:', error);
    return false;
  }
}

// Clear all reservations for a user
export async function clearUserReservations(userId: string): Promise<boolean> {
  try {
    await client.db.cartReservation.deleteMany({
      where: {
        userId: userId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing user reservations:', error);
    return false;
  }
}

// Remove a specific reservation for a user
export async function removeUserCartReservation(productId: number, userId: string): Promise<boolean> {
  try {
    await client.db.cartReservation.deleteMany({
      where: {
        productId: productId,
        userId: userId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error removing user cart reservation:', error);
    return false;
  }
}
