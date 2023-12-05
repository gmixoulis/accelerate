import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import jwt_decode from "jwt-decode";
import { OpenAIModel } from '@/app/[lng]/powerflow/utils/constants';
import { NextResponse } from 'next/server';
import getDownloadUrl from '@/app/[lng]/powerflow/utils/getDownloadUrl';
import { fetchAndEncodeImageToBase64 } from '@/app/[lng]/powerflow/utils';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})



// Function to download image and return new item
async function downloadImageAndTransformItem(item) {
  if (item.id) {
    let url = "";
    const handleDownload = await getDownloadUrl(item.id);
    let base64 = "";
    url = handleDownload.downloadUrl;
    await fetchAndEncodeImageToBase64(url)
      .then(base64Image => {
        base64 = `data:${item.file_type};base64,${base64Image}`
      })
      .catch(error => {
        // Handle errors here
        return null;
      });
    return {
      type: "image_url",
      image_url: {
        url: base64
      }
    };
  }
  return item;
}

// Function to transform message
async function transformMessage(message) {
  if (message.role === "assistant") {
    return message;
  }

  const contentWithImages = (await Promise.all(message.content.map(downloadImageAndTransformItem))).filter(item => item !== null);

  return {
    ...message,
    content: contentWithImages
  };
}


export async function POST(req) {
  const { messages, model, max_tokens } = await req.json();
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const userId = refreshToken ? jwt_decode(refreshToken).UserID : null;
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized, user id not found" }), { status: 401 })
  const messagesWithoutModel = messages.map(({ role, content }) => ({ role, content }));
  try {
    let response;
        // Download the images
        const messagesWithImages = await Promise.all(messagesWithoutModel.map(transformMessage));

        response = await openai.chat.completions.create({
          model: model,
          stream: true,
          temperature: 0.0,
          messages: [
            {
              role: "system",
              content: `You are a helpful, friendly, assistant. You should write your responses in markdown but display them properly. When asked for a code snippet you should write the language in markdown.`
            },
            ...messagesWithImages
          ],
          max_tokens: 4000
        })
    
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