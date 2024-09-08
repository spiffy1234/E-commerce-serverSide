import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Category from "@/model/categoryModel";
import { NextRequest, NextResponse } from "next/server";

connect();

//Read a category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: String } }
) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 404 }
      );
    }
    //find category
    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: "No category with specified id" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        category,
        success: true,
        message: "Category found",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: String } }
) {
  try {
    const loggedInUserId = await getIdFromToken(request);
    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not Logged in." },
        { status: 404 }
      );
    }
    const id = params.id;
    const { name, description, parentCategory } = await request.json();

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        parentCategory,
      },
      {
        new: true,
      }
    );
    if (!updatedCategory) {
      return NextResponse.json({ error: "Cannot Update" }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Update successfully", success: true, updatedCategory },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//delete a Category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: String } }
) {
  try {
    const loggedInUserId = await getIdFromToken(request);
    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in" },
        { status: 400 }
      );
    }

    const id = params.id;

    const deletedCategories = await Category.findByIdAndDelete(id);

    if (!deletedCategories) {
      return NextResponse.json({ error: "Cannot delete" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "deleted successfully", success: true, deletedCategories },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
