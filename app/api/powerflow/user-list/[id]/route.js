import { NextResponse } from "next/server";
import { editList, deleteList, getList } from "@/app/[lng]/powerflow/utils/powerflow-api/user-lists";
import jwt_decode from "jwt-decode";

export async function PUT(req) {
    const list = await req.json();

    const refreshToken = req.cookies.get('refreshToken')?.value;
    const user_id = refreshToken ? jwt_decode(refreshToken).UserID : null;

    if (!user_id) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 });

    list.user_id = user_id.toString();

    try {
        const response = await editList(list);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in POST: ", err);
        return NextResponse.json({err}, { status: 500 });
    }

}

export async function DELETE(req, {params}) {
    const id = params.id;

     //Get user ID from JWT
     const refreshToken = req.cookies.get('refreshToken')?.value;
     const user_id = refreshToken ? jwt_decode(refreshToken).UserID : null;

    try {
        const response = await deleteList(id, user_id);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in DELETE: ", err);
        return NextResponse.json({err}, { status: 500 });
    }
}

export async function GET(req, {params}) {
    const id = params.id;

    const refreshToken = req.cookies.get('refreshToken')?.value;
    const user_id = refreshToken ? jwt_decode(refreshToken).UserID : null;


    try {
        const response = await getList(id, user_id);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in GET: ", err);
        return NextResponse.json({err}, { status: 500 });
    }
}
