import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Cart from "@/model/cartModel";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

connect();

//GET- Reading cart
export async function GET(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 404 }
      );
    }
    //find cart items
    const cart = await Cart.findOne({ user: loggedInUserId });

    if (!cart) {
      return NextResponse.json(
        { error: "No items available", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        cart,
        success: true,
        message: "cart items found",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//POST- Adding an item in cart
export async function POST(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in" },
        { status: 404 }
      );
    }

    const { item } = await request.json();

    console.log(item);

    let cart = await Cart.findOne({ user: loggedInUserId });

    if (!cart) {
      cart = await Cart.create({ user: loggedInUserId, items: [] });
    }

    cart.items = [...cart.items, item];

    cart.save();

    return NextResponse.json(
      { message: "An item added to Cart", success: true, cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//PUT- Empty cart items
export async function PUT(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);
    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not Logged in." },
        { status: 404 }
      );
    }
    const cart = await Cart.findOne({ user: loggedInUserId });

    console.log(cart);

    if (!cart) {
      return NextResponse.json(
        { error: "No items found", success: false },
        { status: 500 }
      );
    }

    cart.items = [];

    cart.save();

    return NextResponse.json(
      { message: "cart is empty ", success: true, cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
