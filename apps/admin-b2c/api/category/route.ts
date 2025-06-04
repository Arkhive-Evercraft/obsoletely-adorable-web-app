import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../src/utils/auth";
import { getCategories, createCategory } from "@repo/db/utils";

// GET handler to fetch all categories
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST handler to create a new category
export async function POST(request: NextRequest): Promise<NextResponse> {
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
    const { name, description, imageUrl } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Create the new category using the function from db/utils/functions.ts
    const newCategory = await createCategory({
      name,
      description: description || "",
      imageUrl: imageUrl || ""
    });
    
    if (!newCategory) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}