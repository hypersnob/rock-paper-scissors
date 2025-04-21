import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${process.env.API_URL}/game/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}
