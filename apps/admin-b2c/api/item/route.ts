import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@repo/db/utils";
import { isLoggedIn } from "../../src/utils/auth";

// GET handler to list all products
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST handler to create a new product
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authenticated = await isLoggedIn();
    if (!authenticated) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, price, description, imageUrl, categoryName, inStock, featured } = body;

    // Validate required fields
    if (!name || !price || !imageUrl || !categoryName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the product using the function from db/utils/functions.ts
    const newProduct = await createProduct({
      name,
      price,
      description: description || "",
      imageUrl,
      categoryName,
      inStock,
      featured
    });

    if (!newProduct) {
      return NextResponse.json(
        { message: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}