import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Order from "@/model/orderModel";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

connect();

//GET - Read all orders

export async function GET(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 404 }
      );
    }

    const orders = await Order.find({});

    return NextResponse.json(
      { message: "Orders listed", success: true, orders },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//POST - create an order

export async function POST(request: NextRequest) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in" },
        { status: 404 }
      );
    }

    const { items, paymentDetails, shippingAddress } = await request.json();

    const order = await Order.create({
      items,
      user: loggedInUserId,
      paymentDetails,
      shippingAddress,
      orderStatus: "PLACED",
    });

    if (!order) {
      return NextResponse.json({ error: "Not ordered yet" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Order create successfully", success: true, order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
