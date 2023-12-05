import { getTokensFromString } from "@/app/[lng]/powerflow/utils/tokenizer";

export async function POST(req) {
  const {model, message} = await req.json();
  try {
    const tokens = getTokensFromString(model, message)
    return new Response(JSON.stringify(tokens), {status: 200});
  } catch (e) {
    return new Response(JSON.stringify({error: e.message}), {status: 500});
  }
}
