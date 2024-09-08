import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Product from "@/model/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

//read all the products
export async function GET(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 404 }
      );
    }
    let products = await Product.find({});
    return NextResponse.json(
      {
        products,
        success: true,
        message: "Sent successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//create a product
export async function POST(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 404 }
      );
    }
    const { images, description, brand, title, price, category, stock } =
      await request.json();

    if (!title && !description && !price) {
      return NextResponse.json({ error: "invalid input" }, { status: 400 });
    }

    const product = await Product.create({
      images,
      description,
      brand,
      title,
      price,
      category,
      stock,
      seller: loggedInUserId,
    });

    return NextResponse.json(
      {
        product,
        success: true,
        message: "product created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
