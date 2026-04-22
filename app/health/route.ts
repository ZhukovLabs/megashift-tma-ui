import {NextResponse} from "next/server";

export const GET = () => {
    return new NextResponse(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}