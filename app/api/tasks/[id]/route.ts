import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updates = await req.json();
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.task.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Erro PATCH /tasks/[id]:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (err) {
    console.error("Erro DELETE /tasks/[id]:", err);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
