export const OpenAIModel = {
    GPT_4: {
        model: "gpt-4",
        max_tokens: 8192
    },
    GPT_4_TURBO: {
        model: "gpt-4-1106-preview",
        max_tokens: 128000
    },
    GPT_4_TURBO_VISION: {
        model: "gpt-4-vision-preview",
        max_tokens: 128000
    },
    GPT_3: {
        model: "gpt-3.5-turbo",
        max_tokens: 4097
    },
    GPT_3_TURBO: {
        model: "gpt-3.5-turbo-1106",
        max_tokens: 16385
    }, 
    GPT_3_INSTRUCT: {
        model: "gpt-3.5-turbo-instruct",
        max_tokens: 4097
    },
}

export const getMaxTokens = (modelName) => {
    //Find the model in the OpenAIModel object
    const model = Object.values(OpenAIModel).find((model) => model.model === modelName);

    //If the model is not found, return the default model
    if (!model) {
        return OpenAIModel.GPT_3.max_tokens;
    }

    //Return the max_tokens value
    return model.max_tokens;
}

export const programmingLanguages = {
    javascript: '.js',
    python: '.py',
    java: '.java',
    c: '.c',
    cpp: '.cpp',
    'c++': '.cpp',
    'c#': '.cs',
    ruby: '.rb',
    php: '.php',
    swift: '.swift',
    'objective-c': '.m',
    kotlin: '.kt',
    typescript: '.ts',
    go: '.go',
    perl: '.pl',
    rust: '.rs',
    scala: '.scala',
    haskell: '.hs',
    lua: '.lua',
    shell: '.sh',
    sql: '.sql',
    html: '.html',
    css: '.css',
    yaml: '.yaml',
    json: '.json',
    markdown: '.md',
    
}
