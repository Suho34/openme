import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Call TinyURL simple text endpoint
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to shorten URL");
    }

    const shortUrl = await res.text();
    return NextResponse.json({ shortUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to shorten URL" }, { status: 500 });
  }
}
