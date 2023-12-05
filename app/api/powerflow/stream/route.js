import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import jwt_decode from "jwt-decode";
import { OpenAIModel } from '@/app/[lng]/powerflow/utils/constants';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  const { messages, model, max_tokens } = await req.json();
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized, user id not found" }), { status: 401 })
  const messagesWithoutModel = messages.map(({ role, content }) => ({ role, content }));
  try {
    let response;
    if (model !== OpenAIModel.GPT_3_INSTRUCT.model) {
      response = await openai.chat.completions.create({
        model: model,
        stream: true,
        temperature: 0.0,
        messages: [
          {
            role: "system",
            content: `You are a helpful, friendly, assistant. You should write your responses in markdown but display them properly. When asked for a code snippet you should write the language in markdown.`
          },
          ...messagesWithoutModel
        ],
      })
    } else {
      response = await openai.completions.create({
        model: model,
        stream: true,
        temperature: 0.0,
        prompt: messagesWithoutModel[messagesWithoutModel.length - 1].content,
        max_tokens: max_tokens,
      })
    }

    const stream = OpenAIStream(response)



    return new StreamingTextResponse(stream, {
      headers: {
        "model": model,
      }
    })
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { type, code, message, status } = error;

      return NextResponse.json({ error: { type, code, message } }, { status });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}