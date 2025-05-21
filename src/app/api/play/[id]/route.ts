import { NextRequest, NextResponse } from "next/server";
import { Move } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { move } = (await request.json()) as { move: Move };
    const { id } = await params;

    if (!move) {
      return NextResponse.json({ error: "Move is required" }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_URL}/play/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
      },
      body: JSON.stringify({ move }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to play game" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error playing game:", error instanceof Error ? error.message : "An unknown error occurred");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
