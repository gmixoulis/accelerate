import { deletePrompt, getPrompt } from "@/app/[lng]/powerflow/utils/powerflow-api/prompt-response";
import jwt_decode from "jwt-decode";
import { NextResponse } from "next/server";



export async function GET(req, {params}) {
    try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;
    if (!userId) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 })

    const data = await getPrompt(params.id, userId);
     return NextResponse.json(data, { status: 200 });
    } catch (err) {
      return NextResponse.json({err}, { status: 500 });
    }
}


export async function DELETE(req, {params}) {
  try {
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;
  if (!userId) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 })

  const data = await deletePrompt(params.id, userId);
   return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({err}, { status: 500 });
  }
}

