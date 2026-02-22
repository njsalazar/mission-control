import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://127.0.0.1:3210"
);

export async function POST() {
  const result = await convex.mutation(api.seed.seedData, {});
  return NextResponse.json({ result });
}
