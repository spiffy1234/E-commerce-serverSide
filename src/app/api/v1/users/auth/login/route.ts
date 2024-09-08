import { connect } from "@/DBConfiguration/dbConfig";
import bcryptjs from "bcryptjs";
import { NextRequest } from "next/server";
import User from "@/model/userModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

connect();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    let { email, password } = data;

    console.log(data);
    //we are finding the user through email
    const user = await User.findOne({ email });

    //we are checking the user exist or not
    if (!user) {
      return Response.json({ error: "User doesnot exist" }, { status: 400 });
    }

    //we are comparing the password
    const validPassword = await bcryptjs.compare(password, user.password);

    //we are checking the password
    if (!validPassword) {
      return Response.json({ error: "Password incorrect" }, { status: 500 });
    }

    //creating token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    //setup cookies
    const cookie = cookies();
    cookie.set("token", token, { httpOnly: true });
    return Response.json(
      {
        msg: "Login successfully",
        success: true,
        headers: {
          "Set-Cookie": `token=${token}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
