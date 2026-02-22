import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210"
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  await convex.mutation(api.tasks.updateTask, {
    id: id as Id<"tasks">,
    ...body,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await convex.mutation(api.tasks.deleteTask, { id: id as Id<"tasks"> });
  return NextResponse.json({ ok: true });
}
