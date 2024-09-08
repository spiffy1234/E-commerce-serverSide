import { connect } from "@/DBConfiguration/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    let {
      firstname,
      lastname,
      email,
      mobile,
      password,
      confirmpassword,
      address,
    } = data;

    //checking password
    if (password !== confirmpassword) {
      return NextResponse.json(
        { error: "Both password doesnot match!" },
        { status: 400 }
      );
    }

    //find the user
    const user = await User.findOne({ email });

    //check the user already exist
    if (user) {
      return Response.json({ error: "User already exist" }, { status: 500 });
    }

    //hashing
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    //creating a new user
    let newUser = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      address,
      password: hashedPassword,
    });

    return Response.json(
      {
        newUser,
        success: true,
        msg: "Signup successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
