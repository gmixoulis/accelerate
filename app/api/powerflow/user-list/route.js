import { getLists } from "@/app/[lng]/powerflow/utils/powerflow-api/user-lists";
import jwt_decode from "jwt-decode";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const user_id = refreshToken ? jwt_decode(refreshToken).UserID : null;

    if (!user_id) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 });

    try {
        const response = await getLists(user_id);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in GET: ", err);
        return NextResponse.json({err}, { status: 500 });
    }
}