import { NextRequest, NextResponse } from "next/server";
import { GiphyFetch } from "@giphy/js-fetch-api";

const giphyFetch = new GiphyFetch(process.env.GIPHY_API_KEY!);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data } = await giphyFetch.gif(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching GIF:", error);
    return NextResponse.json({ error: "Failed to fetch GIF" }, { status: 500 });
  }
}
