const { Tiktoken } = require("tiktoken");
import { get_encoding, init } from "tiktoken/init";


// | Encoding name       | OpenAI models                                    |
// | ------------------- | ------------------------------------------------ |
// | cl100k_base         | gpt-4, gpt-3.5-turbo, text-embedding-ada-002     |
// | p50k_base           | Codex models, text-davinci-002, text-davinci-003 |
// | r50k_base (or gpt2) | GPT-3 models like davinci 

const openaiModels = {
    "gpt-4": "cl100k_base",
    "gpt-3.5-turbo": "cl100k_base",
    "text-embedding-ada-002": "cl100k_base",
    "text-davinci-003": "p50k_base",
    "davinci": "p50k_base",
    "gpt-3.5-turbo-instruct": "cl100k_base",
    "gpt-4-1106-preview": "cl100k_base",
    "gpt-4-vision-preview": "cl100k_base",
    "gpt-3.5-turbo-1106": "cl100k_base"
};


// | Price per 1000 tokens | OpenAI models          |
// | --------------------- | ---------------------- |
// | 0.03 $ / 1K tokens    | gpt-4                  |
// | 0.02 $ / 1K tokens    | text-davinci-003       |
// | 0.0002 $ / 1K tokens  | gpt-3.5-turbo          |
// | 0.0004 $ / 1K tokens  | text-embedding-ada-002 |

const openaiModelPrices = {
    "gpt-4": 0.03,
    "gpt-3.5-turbo": 0.0002,
    "text-embedding-ada-002": 0.0004,
    "text-davinci-003": 0.02,
    "davinci": 0.02,
};

const getTokensFromString = (encodingModel, text) => {
    const encoding = get_encoding(openaiModels[encodingModel]);
    const tokens = encoding.encode(text);
    encoding.free();
    return tokens.length;
};

const calculateCost = (openaiModel, text) => {
    const numTokens = getTokensFromString(openaiModels[openaiModel], text);
    const cost = numTokens * openaiModelPrices[openaiModel] / 1000;
    return cost;
};

module.exports = {
    getTokensFromString,
    calculateCost,
};