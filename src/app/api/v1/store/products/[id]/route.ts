import { connect } from "@/DBConfiguration/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/model/productModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import { error } from "console";

connect();

//Read a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: String } }
) {
  try {
    //find product
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: "no product" }, { status: 400 });
    }
    return NextResponse.json(
      {
        product,
        success: true,
        message: "Product found",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Update a Product
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
    const { images, description, brand, title, price, category, stock } =
      await request.json();
    const { seller } = await Product.findById(id).select("seller");

    if (loggedInUserId != seller._id.toString()) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 400 }
      );
    }

    const existingImages = await Product.findById(id).select("images");

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: [...existingImages.images, ...images],
        description,
        brand,
        title,
        price,
        category,
        stock,
      },
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return NextResponse.json({ error: "Cannot Update" }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Update successfully", success: true, updatedProduct },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//delete a product
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

    const { seller } = await Product.findById(id).select("seller");

    if (seller._id.toString() !== loggedInUserId) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 400 }
      );
    }

    const deletedProducts = await Product.findByIdAndDelete(id);

    if (!deletedProducts) {
      return NextResponse.json({ error: "Cannot delete" }, { status: 200 });
    }

    return NextResponse.json(
      { error: "deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
