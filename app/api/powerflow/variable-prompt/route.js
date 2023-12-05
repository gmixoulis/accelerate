import jwt_decode from "jwt-decode";
import { NextResponse } from "next/server";
import { instance } from "@/app/[lng]/powerflow/utils/powerflow-api/powerflowRequest";
const ENDPOINT = '/variable-prompt';


async function sendVariablePrompt(prompt) {
    try {
        const url = `${ENDPOINT}/`;
        const response = await instance.post(url, prompt);
        return response.data;
    } catch (err) {
        if (err.response) {
            return {
                message: err.message,
                status: err.response.status,
                data: err.response.data,
            };
        }
        return { message: err.message };
    }
}

export async function POST(req) {
    try {
    const { prompt } = await req.json();
    
    //Get user ID from JWT
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;
    if (!userId) return NextResponse.json({error: "Unauthorized, user id not found"}, { status: 401 });

    prompt.user_id = userId.toString();
    const data = await sendVariablePrompt(prompt);
     return NextResponse.json(data, { status: 200 });
    } catch (err) {
      return NextResponse.json({err}, { status: 500 });
    }
  }