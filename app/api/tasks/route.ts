import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";
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
      return NextResponse.json({ error: "Token not provided" }, { status: 400 });
    }

    let payload: any;
    try {
      payload = verifyJwt<{ sub: string }>(token);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: payload.sub },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
      return NextResponse.json({ error: "Token not provided" }, { status: 400 });
    }

    let payload: any;
    try {
      payload = verifyJwt<{ sub: string }>(token);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }


    const body = await req.json();
    const { title, description, dueDate } = body;
   

    if (!title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        userId: payload.sub, 
        title,
        description: description || "",
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "pending",
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
