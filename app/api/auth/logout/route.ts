import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { message: "Logout realizado" },
    { status: 200 }
  );

  res.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return res;
}
