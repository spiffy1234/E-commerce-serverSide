import { connect } from "@/DBConfiguration/dbConfig";
import User from "@/model/userModel";
import bcryptjs from "bcryptjs";

connect();
export async function POST(request: Request) {
  try {
    let { token, password } = await request.json();

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return Response.json({ error: "Invalid Token" }, { status: 400 });
    }

    //password hashing

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return Response.json({ msg: "Password reset successful", success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
