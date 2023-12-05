
import { editStream } from "@/app/[lng]/powerflow/utils/powerflow-api/saving-stream";
import jwt_decode from "jwt-decode";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
  const {chatId, title, model, messages } = await req.json();

  const refreshToken = req.cookies.get('refreshToken')?.value;
  const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;
  if (!userId) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 });
  
  const params = {chat_id: chatId, user_id: userId.toString(), user_prompts: messages, title: title, model: model}
  const data = await editStream(params);
  return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({err}, { status: 500 });
  }
}
