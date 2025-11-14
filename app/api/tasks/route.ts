import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("Erro GET /tasks:", err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("REQ BODY RECEBIDO:", body);

    const { title, description, dueDate, status, userId } = body;

    if (!title || !userId) {
      return NextResponse.json(
        { error: "Título e usuário são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar status
    let safeStatus = "pending";

    if (
      typeof status === "string" &&
      ["pending", "done", "canceled"].includes(status)
    ) {
      safeStatus = status;
    } else {
      console.warn("Status inválido recebido:", status);
    }

    // Validar data
    let parsedDate: Date | null = null;

    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      } else {
        console.warn("Data inválida recebida:", dueDate);
      }
    }

    // Criar tarefa
    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        status: safeStatus,
        dueDate: parsedDate,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("Erro POST /tasks:", err);
    return NextResponse.json(
      { error: "Falha ao criar tarefa (dados inválidos)" },
      { status: 500 }
    );
  }
}
