import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../src/utils/auth";
import { getProductById, updateProduct, deleteProduct, toggleProductStockStatus } from "@repo/db/utils";

// GET handler to get a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await getProductById(productId);
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params;
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if this is a toggle stock status request
    if (body.hasOwnProperty('inStock') && Object.keys(body).length === 1) {
      const updatedProduct = await toggleProductStockStatus(productId);
      
      if (!updatedProduct) {
        return NextResponse.json(
          { message: "Failed to update product stock status" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedProduct);
    }
    
    // Otherwise, it's a regular update
    const { name, price, description, imageUrl, categoryName, featured } = body;

    // Update the product using the function from db/utils/functions.ts
    const updatedProduct = await updateProduct(productId, {
      name,
      price,
      description,
      imageUrl,
      categoryName,
      featured
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Failed to update product" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const authenticated = await isLoggedIn();
    if (!authenticated) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Delete the product using the function from db/utils/functions.ts
    const success = await deleteProduct(productId);

    if (!success) {
      return NextResponse.json(
        { message: "Failed to delete product" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}