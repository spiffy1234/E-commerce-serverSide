import { cookies } from "next/headers";

export async function GET() {
  try {
    //deleting token cookie
    await cookies().delete("token");
    return Response.json({
      msg: "logout successful",
      success: true,
      headers: { "Set-Cookie": `token=""` },
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
