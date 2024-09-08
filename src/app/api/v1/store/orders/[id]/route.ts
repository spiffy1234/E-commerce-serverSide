import { connect } from "@/DBConfiguration/dbConfig";
import { getIdFromToken } from "@/helpers/getIdFromToken";
import Order from "@/model/orderModel";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

connect();

//PATCH - Cancel the order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: String } }
) {
  try {
    const loggedInUserId = await getIdFromToken(request);

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: "You are not logged in" },
        { status: 404 }
      );
    }

    const orderId = params.id;

    const { user } = await Order.findById(orderId).select("user");

    if (user._id.toString() != loggedInUserId) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 500 }
      );
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      orderStatus: "CANCELED",
    });

    return NextResponse.json(
      { message: "Order canceled", success: true, order },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
