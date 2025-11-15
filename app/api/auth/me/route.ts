import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") ?? "";
    const match = cookie.match(/(^|; )token=([^;]+)/);
    let token = match ? decodeURIComponent(match[2]) : null;

    if (!token) {
      const auth = req.headers.get("authorization");
      if (auth && auth.startsWith("Bearer ")) {
        token = auth.substring(7);
      }
    }

    if (!token) {
      token = req.headers.get("x-access-token") ?? null;
    }

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let payload: any;
    try {
      payload = verifyJwt<{ sub: string }>(token);
    } catch (err) {
      const res = NextResponse.json({ user: null }, { status: 200 });
      res.cookies.set({
        name: "token",
        value: "",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao recuperar sessão" },
      { status: 500 }
    );
  }
}