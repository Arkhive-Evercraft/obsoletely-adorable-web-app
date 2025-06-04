import { client } from "@repo/db/client"
import { products, categories } from "@repo/db/data"

export async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    // Clear existing data
    await client.db.productSale.deleteMany();
    await client.db.sale.deleteMany();
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
          imageUrl: product.imageUrl,
          inStock: product.inStock ?? true,
          featured: product.featured ?? false,
          categoryName: product.categoryName,
        },
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
