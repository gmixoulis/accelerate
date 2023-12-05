import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_ASSISTANT,
})

const openai = new OpenAIApi(configuration) 
 
export async function POST(req) {
  const { fullMessages, messages, model } = await req.json();
  const messagesWithoutModel = messages.map(({ role, content }) => ({ role, content }))


  const response = await openai.createChatCompletion({
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

  if (!response.ok) {
    const body = await response.json();
    return new Response(JSON.stringify({ error: {
      message: body.error.message,
      code: body.error.code,
      type: body.error.type
    }}), { status: 500 })
  }
 
  const stream = OpenAIStream(response)



  return new StreamingTextResponse(stream)
}