import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
