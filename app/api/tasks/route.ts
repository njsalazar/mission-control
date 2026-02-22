import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210"
);

export async function GET() {
  const tasks = await convex.query(api.tasks.getTasks);
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = await convex.mutation(api.tasks.createTask, {
    title: body.title,
    description: body.description,
    status: body.status,
    assignee: body.assignee,
  });
  return NextResponse.json({ id }, { status: 201 });
}
