import { NextResponse } from "next/server";
import { addList } from "@/app/[lng]/powerflow/utils/powerflow-api/user-lists";
import jwt_decode from "jwt-decode";

export async function POST(req) {
    const user_list = await req.json();

    //Get user ID from JWT
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;

    if (!userId) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 });

    user_list.user_id = userId.toString();

    try {
        const response = await addList(user_list);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in POST: ", err);
        return NextResponse.json({err}, { status: 500 });
    }

}