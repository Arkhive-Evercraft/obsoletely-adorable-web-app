import { getCategoryByName, updateCategory, deleteCategory } from '@repo/db/functions';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    // Await params before accessing its properties (Next.js 15 requirement)
    const { name } = await params;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await getCategoryByName(decodeURIComponent(name));
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    // Await params before accessing its properties (Next.js 15 requirement)
    const { name } = await params;
    const body = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const { name: newName, description, imageUrl } = body;
    
    if (!description && !imageUrl && !newName) {
      return NextResponse.json(
        { error: 'At least one field (name, description or imageUrl) is required' },
        { status: 400 }
      );
    }

    // Build update data object
    const updateData: Partial<{ name: string; description: string; imageUrl: string }> = {};
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (newName !== undefined) updateData.name = newName;

    const updatedCategory = await updateCategory(decodeURIComponent(name), updateData);
    
    if (!updatedCategory) {
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    // Await params before accessing its properties (Next.js 15 requirement)
    const { name } = await params;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const result = await deleteCategory(decodeURIComponent(name));
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete category or category has associated products' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}