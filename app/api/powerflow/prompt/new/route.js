import { sendPrompts } from "@/app/[lng]/powerflow/utils/powerflow-api/prompt-response";
import jwt_decode from "jwt-decode";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
    const { prompt } = await req.json();
    
    //Get user ID from JWT
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;
    if (!userId) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 });

    prompt.user_id = userId.toString();
    const data = await sendPrompts(prompt);
     return NextResponse.json(data, { status: 200 });
    } catch (err) {
      return NextResponse.json({err}, { status: 500 });
    }
  }