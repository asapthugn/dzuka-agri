import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");
  const backendRes = await fetch(
    `${backendUrl}/api/recommendation/stream`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!backendRes.ok || !backendRes.body) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", content: "Backend unavailable" })}\n\n`,
      { status: 502, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  return new Response(backendRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
