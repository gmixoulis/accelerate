import { NextResponse } from "next/server";
import jwt_decode from "jwt-decode";
import { createStream } from "@/app/[lng]/powerflow/utils/powerflow-api/saving-stream";

export async function POST(req) {
  try {
  const {model, title} = await req.json();

  const refreshToken = req.cookies.get('refreshToken')?.value;
  const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;

  if (!userId) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 });
  
  const data = await createStream(userId, model, title);
  return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({err}, { status: 500 });
  }
}


