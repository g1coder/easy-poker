import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
    return NextResponse.json(
        {
            message: "WebSocket server is running",
            note: "Socket.io connection should be made directly to /api/socket/io",
        },
        { status: 200 }
    );
}

export async function POST(_: NextRequest) {
    return NextResponse.json(
        { message: "Socket.io server endpoint" },
        { status: 200 }
    );
}
