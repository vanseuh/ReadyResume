import { NextRequest, NextResponse } from "next/server";
import { getAdminStats, logTransaction } from "@/lib/rateLimiter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const pinHeader = req.headers.get("x-admin-pin");
  const { searchParams } = new URL(req.url);
  const pinQuery = searchParams.get("pin");
  
  const expectedPin = process.env.ADMIN_PIN || "260310";
  const providedPin = (pinHeader || pinQuery || "").trim();

  if (providedPin !== expectedPin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Invalid Admin Passcode." },
      { status: 401 }
    );
  }

  const stats = getAdminStats();

  return NextResponse.json({
    success: true,
    data: stats,
    serverTime: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const pinHeader = req.headers.get("x-admin-pin");
  const expectedPin = process.env.ADMIN_PIN || "260310";

  if (pinHeader !== expectedPin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    if (body.action === "record_manual_unlock" && body.utr) {
      logTransaction({
        utr: String(body.utr),
        timestamp: Date.now(),
        ip: "admin_manual",
        amount: 49,
        status: "verified",
      });
      return NextResponse.json({ success: true, message: "Transaction logged successfully." });
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
}
