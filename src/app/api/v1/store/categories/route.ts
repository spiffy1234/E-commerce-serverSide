import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Category from "@/model/categoryModel";
import { NextRequest, NextResponse } from "next/server";

connect();

//read all the categories
export async function GET(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged In." },
        { status: 404 }
      );
    }

    let categories = await Category.find({});
    return NextResponse.json(
      {
        categories,
        success: true,
        message: "Sent successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//create a category
export async function POST(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged In." },
        { status: 404 }
      );
    }
    const { name, description, parentCategory } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      description,
      parentCategory,
    });

    return NextResponse.json(
      {
        category,
        success: true,
        message: "Category creating successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
