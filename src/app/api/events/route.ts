import { NextResponse } from "next/server";
import { listPublicEvents } from "@/lib/services/events";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listPublicEvents(Object.fromEntries(searchParams.entries()));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load events" },
      { status: 400 }
    );
  }
}
