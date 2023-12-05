"use server"

import getSecret from "aws-config"

export default async function fetchSecret() {
  if (process.env.APP_ENV === "LOCAL") {
    return JSON.stringify({
      OPENAI_API_KEY_ASSISTANT: process.env.OPENAI_API_KEY_ASSISTANT,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    });
  } else {
    try {
      const secret = await getSecret("staging/accelerate/frontend-api")
      //console log - TEST
      return secret
    } catch (err) {
      console.log("error:", err)
      return err
    }
  }
}