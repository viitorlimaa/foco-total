import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // await obrigatório
  const updates = await request.json();

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Erro PATCH /tasks/[id]:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (err) {
    console.error("Erro DELETE /tasks/[id]:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
