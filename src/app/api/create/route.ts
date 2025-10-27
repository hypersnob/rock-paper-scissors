import { NextRequest, NextResponse } from "next/server";
import { GameRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GameRequest;

    const response = await fetch(`${process.env.API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create game" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Error creating game:",
      error instanceof Error ? error.message : "An unknown error occurred",
    );
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 },
    );
  }
}
