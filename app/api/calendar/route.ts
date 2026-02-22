import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210"
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const entries = await convex.query(api.calendar.getEntries, {
    month: month ? Number(month) : undefined,
    year: year ? Number(year) : undefined,
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = await convex.mutation(api.calendar.createEntry, {
    title: body.title,
    description: body.description,
    type: body.type ?? "task",
    scheduledAt: body.scheduledAt ?? Date.now(),
    status: body.status,
  });
  return NextResponse.json({ id }, { status: 201 });
}
