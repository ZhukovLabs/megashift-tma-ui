import {NextResponse} from "next/server";

export const GET = () => {
    return new NextResponse(JSON.stringify(process.env, null, 2), {
        headers: new Headers({
            "content-type": "application/json"
        })
    });
}