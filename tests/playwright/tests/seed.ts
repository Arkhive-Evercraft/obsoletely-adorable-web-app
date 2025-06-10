import { client } from "@repo/db/client"
import { products, categories } from "@repo/db/data"

// Sample customers data
const customers = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    address: "123 Main St, Anytown, ST 12345"
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0102",
    address: "456 Oak Ave, Springfield, ST 67890"
  },
  {
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1-555-0103",
    address: "789 Pine Rd, Riverside, ST 11111"
  },
  {
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1-555-0104",
    address: "321 Elm St, Lakeside, ST 22222"
  },
  {
    name: "David Davis",
    email: "david.davis@email.com",
    phone: "+1-555-0105",
    address: "654 Maple Dr, Hilltown, ST 33333"
  },
  {
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+1-555-0106",
    address: "987 Cedar Ln, Oceanview, ST 44444"
  }
];

export async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    // Clear existing data in the correct order (respecting foreign key constraints)
    await client.db.productSale.deleteMany();
    await client.db.sale.deleteMany();
    await client.db.customer.deleteMany();
    await client.db.product.deleteMany();
    await client.db.category.deleteMany();
    
    // First, create all categories
    console.log("Creating categories...");
    for (const category of categories) {
      await client.db.category.create({
        data: {
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
        },
      });
    }
    
    // Then, create all products with their category relationship
    console.log("Creating products...");
    for (const product of products) {
      await client.db.product.create({
        data: {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description || "",
          story: product.story || "",
          imageUrl: product.imageUrl,
          categoryName: product.categoryName,
          inventory: product.inventory || 0,
          updatedAt: product.updatedAt
        },
      });
    }
    
    // Create customers and store their actual IDs
    console.log("Creating customers...");
    const createdCustomers = [];
    for (const customer of customers) {
      const createdCustomer = await client.db.customer.create({
        data: customer,
      });
      createdCustomers.push(createdCustomer);
    }
    
    // Create 20 sample sales
    for (let i = 1; i <= 20; i++) {
      // Pick random customer from the actually created customers
      const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      if (!randomCustomer) continue; // Skip if no customer is found
      const customerId = randomCustomer.id;
      
      // Pick random date within last 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - daysAgo);
      
      // Create the sale first
      const sale = await client.db.sale.create({
        data: {
          customerId,
          date: saleDate,
          total: 0, // Will be calculated after adding items
        },
      });
      
      // Add 1-4 random products to this sale (ensure unique products per sale)
      const numItems = Math.floor(Math.random() * 4) + 1;
      let saleTotal = 0;
      const usedProductIds = new Set<number>();
      
      for (let j = 0; j < numItems; j++) {
        let productId: number;
        let attempts = 0;
        
        // Find a product that hasn't been used in this sale yet
        do {
          productId = Math.floor(Math.random() * products.length) + 1;
          attempts++;
        } while (usedProductIds.has(productId) && attempts < 10);
        
        // If we couldn't find a unique product after 10 attempts, skip this item
        if (usedProductIds.has(productId)) {
          continue;
        }
        
        usedProductIds.add(productId);
        const product = products.find((p: any) => p.id === productId);
        
        if (product) {
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = product.price;
          
          await client.db.productSale.create({
            data: {
              saleId: sale.id,
              itemId: productId,
              quantity,
              price,
            },
          });
          
          saleTotal += price * quantity;
        }
      }
      
      // Update the sale total
      await client.db.sale.update({
        where: { id: sale.id },
        data: { total: saleTotal },
      });
    }
    
    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Execute seed function if this file is run directly
if (process.argv[1] === import.meta.url.substring(7)) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
