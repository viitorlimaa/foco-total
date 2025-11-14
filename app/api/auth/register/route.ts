import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword },
      select: { id: true, email: true, name: true },
    });

    // Gerar JWT
    const token = signJwt({ sub: newUser.id });

    const res = NextResponse.json({ user: newUser }, { status: 201 });
    // Set cookie (HTTP only)
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return res;
  } catch (err) {
    console.error("Erro POST /auth/register:", err);
    return NextResponse.json(
      { error: "Falha ao registrar usuário" },
      { status: 500 }
    );
  }
}
