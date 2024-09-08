import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Wishlist from "@/model/wishlistModel";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/model/productModel";

connect();

//PATCH -Remove an item from wishlist

export async function PATCH(
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

    const itemId = params.id;

    const wishlist = await Wishlist.findOne({ user: loggedInUserId });

    if (!wishlist) {
      return NextResponse.json(
        { error: "No wishlist found!" },
        { status: 400 }
      );
    }

    wishlist.items = await wishlist.items.filter(
      (item: String) => item != itemId
    );

    wishlist.save();

    return NextResponse.json(
      { error: "Remove an item from wishlist", success: true, wishlist },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//GET - Reading an item from wishlist

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not authenticate" },
        { status: 400 }
      );
    }

    const itemId = params.id;

    const wishlist = await Wishlist.findOne({ user: loggedInUserId });

    if (!wishlist) {
      return NextResponse.json(
        { error: "No wishlist found!" },
        { status: 400 }
      );
    }

    const foundItemId = await wishlist.items.find(
      (item: String) => item == itemId
    );

    const product = await Product.findById(foundItemId);

    if (!product) {
      return NextResponse.json(
        { error: "No item found ", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Wishlist show successfully", success: true, product },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
