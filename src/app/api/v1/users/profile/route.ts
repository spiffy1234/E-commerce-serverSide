import { connect } from "@/DBConfiguration/dbConfig";
import { NextRequest } from "next/server";
import User from "@/model/userModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";
connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getIdFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    return Response.json({ msg: "User Found", success: true, user });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
