import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Wishlist from "@/model/wishlistModel";
import { NextRequest, NextResponse } from "next/server";

connect();

//Read  Wishlist
export async function GET(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in." },
        { status: 404 }
      );
    }
    //find Wishlist
    const wishlist = await Wishlist.findOne({ user: loggedInUserId });

    if (!wishlist) {
      return NextResponse.json(
        { error: "No Wishlist with specified id" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        wishlist,
        success: true,
        message: "Wishlist found",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Empty Wishlist
export async function PUT(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);
    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not Logged in." },
        { status: 404 }
      );
    }
    const wishlist = await Wishlist.findOne({ user: loggedInUserId });

    if (!wishlist) {
      return NextResponse.json(
        { error: "No wishlist found", success: false },
        { status: 500 }
      );
    }

    wishlist.items = [];

    wishlist.save();

    return NextResponse.json(
      { message: "Wishlist empty successfully", success: true, wishlist },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//POST - Adding an item to wishlist

export async function POST(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in" },
        { status: 500 }
      );
    }

    const { item } = await request.json();

    let wishlist = await Wishlist.findOne({ user: loggedInUserId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: loggedInUserId, items: [] });
    }

    wishlist.items = [...wishlist.items, item];

    wishlist.save();
    return NextResponse.json(
      {
        message: "An item added to wishlist  successfully",
        success: true,
        wishlist,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
