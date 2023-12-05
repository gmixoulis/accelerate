// aws_get_secret.mjs
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

// Create a Secrets Manager client
const client = new SecretsManagerClient({ region: "eu-central-1" })

async function getSecret(secretName) {
  try {
    const data = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    )
    if ("SecretString" in data) {
      let secret = data.SecretString
      return secret
    } else {
      let buff = Buffer.from(data.SecretBinary, "base64")
      let decodedBinarySecret = buff.toString("ascii")
      return decodedBinarySecret
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export default getSecret