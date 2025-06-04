import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../src/utils/auth";
import { getCategoryByName, updateCategory, deleteCategory } from "@repo/db/utils";

// GET handler to fetch a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    const category = await getCategoryByName(name);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { name: string } }
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
    const { name } = params;
    const { description, imageUrl } = body;

    // Update the category using the function from db/utils/functions.ts
    const updatedCategory = await updateCategory(name, {
      description,
      imageUrl,
    });

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Failed to update category" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
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

    const { name } = params;

    // Delete the category using the function from db/utils/functions.ts
    const success = await deleteCategory(name);

    if (!success) {
      return NextResponse.json(
        { message: "Failed to delete category" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);

    // Special error for when category has associated products
    if (error instanceof Error && error.message.includes("associated products")) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 }
    );
  }
}