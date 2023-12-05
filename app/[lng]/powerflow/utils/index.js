import { convertMarkdownToHtml } from "./markdownToHtml";
import { exportToDocx } from "./exportToDocx";
import { OpenAIModel, getMaxTokens } from "./constants";
import axios from "axios";
import { convertWebpToPng } from "./actions";
import { getDownloadUrl } from "./fileServices";

export function formatDate(dateInput, displayTime = true) {
    if(!dateInput) return "";
    if (dateInput === "N/A") return "N/A";
    const date = typeof dateInput === 'string' ? new Date(dateInput + 'Z') : dateInput;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (displayTime) 
      return `${day}/${month}/${year} @ ${hours.toLocaleString(undefined, {minimumIntegerDigits: 2})}:${minutes.toLocaleString(undefined, {minimumIntegerDigits: 2})}`;
      
    return `${day}/${month}/${year}`;
}


export function getStatusBadge(status, text) {
  switch (status) {
     case "done":
      return <span className="bg-green-50 text-green-900 text-md font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-green-800 dark:text-white">{text}</span>
     case "in progress":
       return <span className="bg-yellow-100 text-brown-800 text-md font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-yellow-500 dark:!text-brown-900">{text}</span>;
     case "failed":
       return <span className="bg-red-50 text-red-900 text-md font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-white">{text}</span>;
     case "in queue":
       return <span className="bg-light-blue-50 text-light-blue-900 text-md font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-light-blue-900 dark:text-white">{text}</span>;
     case "retrying":
       return <span className="text-md mr-2 px-2 py-0.5 rounded-full font-medium text-deep-orange-900 bg-orange-50 dark:bg-orange-900 dark:text-white">{text}</span>;
     default:
       return <span className="bg-blue-gray-100 text-blue-gray-900 text-md font-medium mr-2 px-2 py-0.5 rounded-full dark:bg-blue-gray-700 dark:text-white">{text}</span>;
  }

}


export const handleCopyClick = async ({model, content}) => {
  let markdown = content;
  let text = content;
  if (model === OpenAIModel.GPT_4_TURBO_VISION.model && Array.isArray(content)) {
    markdown = await convertContentToMarkdown(content);
    text = text[0].text;
  }
  const contentBlobHtml = new Blob([convertMarkdownToHtml(markdown)], { type: "text/html" });
  const contentBlobPlainText = new Blob([text], { type: "text/plain" });

  if (window.ClipboardItem) {
    navigator.clipboard.write([
      new ClipboardItem({
        "text/html": contentBlobHtml,
        "text/plain": contentBlobPlainText,
      }),
    ])
      .then(
        () => {
          console.log("Text copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
  } else {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Fallback: Text copied to clipboard!');
      })
      .catch(err => {
        console.error('Fallback: Could not copy text: ', err);
      });
  }
};

    export const updateSearchParams = (type, value, searchParams, pathname) => {
      // Get the current URL search params
      const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    
      // Set the specified search parameter to the given value
      currentSearchParams.set(type, value);
    
      // Set the specified search parameter to the given value
      const newPathname = `${pathname}?${currentSearchParams.toString()}`;
    
      return newPathname;
    };
    
    export const deleteSearchParams = (type, searchParams, pathname) => {
      // Set the specified search parameter to the given value
      const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    
      // Delete the specified search parameter
      newSearchParams.delete(type.toLocaleLowerCase());
    
      // Construct the updated URL pathname with the deleted search parameter
      const newPathname = `${pathname}?${newSearchParams.toString()}`;
    
      return newPathname;
    };


export function handleExportClick (content, contentType) {
      const date = new Date();
      const fileName = `powerflow_${contentType}_${date.toISOString().split("T")[0]}_${date.getTime()}.doc`;
      exportToDocx(content, fileName);
};

export async function getThread(chatId) {
  try {
    const response = await fetch(`/api/powerflow/prompt/${chatId}`, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`Error getting thread: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.data) {
      console.log("No data found, returning empty array");
      return undefined;
    }

    const prompt = data.data[0];
    let chat_arr = JSON.parse(prompt.chat_json);
    if (chat_arr?.length > 0 && chat_arr[0].role === "system") {
      chat_arr = chat_arr.slice(1);
    }
    prompt.chat_json = chat_arr;
    return prompt;

  } catch (err) {
    console.log("Error getting thread: ", err);
    return undefined;
  }
}


export async function fetchTokens(model, text) {
  try {
    const response = await fetch("/api/tokens", 
    { method: "POST",
      body: JSON.stringify({
        model: model,
        message: text,
    }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`${data.error}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error fetching tokens: ", err);
    return 0;
  }
};


const orderMessages = async (messages, model) => {
  let lists = messages.reduce((acc, item) => {
    acc[item.role].push(item);
    return acc;
  }, {user: [], assistant: []});
  
  let outputList = [];
  //beginning part essential
  outputList.push(lists.user[0]);

  //end part essential
  outputList.push(lists.assistant.pop());
  outputList.push(lists.user.pop()); 

  //middle part flow:
  //feed as many prompts as possible under x limit
  //simultaneous loop, user and assistant list starting second last
  //every pass, count tokens and make check
  let totalBaseTokens = await fetchTokens(model, outputList.map(item => item.content).join("\n"));
  if (totalBaseTokens > getMaxTokens(model) - 800) {
    return outputList;
  }

  let totalTokens = totalBaseTokens;
  let userListLength = lists.user.length;
  let assistantListLength = lists.assistant.length;

  let middleList = [];

  for (let index = 0; index < Math.min(userListLength, assistantListLength); index++) {
    let user = lists.user[userListLength - index - 1];
    let assistant = lists.assistant[assistantListLength - index - 1];

    let sectionTokens = await fetchTokens(model, user.content + assistant.content);

    if (totalTokens + sectionTokens >= getMaxTokens(model) - 800) {
      console.log("not enough tokens")
      break;
    } else {
      totalTokens += sectionTokens;
      middleList.push(user);
      middleList.push(assistant);
    } 
}


outputList = [...outputList.slice(0, 1), ...middleList.reverse(), ...outputList.slice(1)];
return outputList;      
}

export const tokenHandler = async (messages, model) => {
  if (model === OpenAIModel.GPT_4_TURBO_VISION.model) {
    return messages;
  }
let text = messages.map((message) => message.content).join("\n");
let totalTokens = await fetchTokens(model, text);

if (totalTokens > getMaxTokens(model) - 800) {
let outputList = await orderMessages(messages, model);
return outputList;
}

return messages;
}

export async function getChatId(model, title) {
    const requestBody = {
      model: model,
      title: title,
      }
    const response = await fetch("/api/powerflow/start-thread", {
      method: "POST",
      body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        console.log("error: ", error);
        throw new Error();
      }

      const data = await response.json();
      
      if (data.status_code !== 201) {
        console.log("error: ", data);
        throw new Error();
      }

      console.log("data: ", data)
      
      return data.data;
}


export function getDisplayName(model) {
  switch (model) {
    case OpenAIModel.GPT_3_INSTRUCT.model: return "ChatGPT 3.5 Instruct";
    case OpenAIModel.GPT_3.model: return "ChatGPT 3.5";
    case OpenAIModel.GPT_4.model: return "ChatGPT 4";
    case OpenAIModel.GPT_4_TURBO.model: return "ChatGPT 4 Turbo";
    case OpenAIModel.GPT_4_TURBO_VISION.model: return "ChatGPT 4 Vision";
    case OpenAIModel.GPT_3_TURBO.model: return "ChatGPT 3.5 Turbo";
    default: return "ChatGPT 4";
  }
}

export const processPrompts = (input) => {
  let prompts = input.split("||");
  prompts = prompts.filter((prompt) => prompt.trim());
  let processedPrompts = [];

  //remove empty prompts
  prompts = prompts.filter((prompt) => prompt.trim() !== "|");

  prompts.forEach((prompt, index) => {
    const repeatRgx = /(\|)(\d+)/;
    const repeatMatch = prompt.match(repeatRgx);

    //check if next prompt is not a repeat prompt
    const nextRepeatMatch = (index + 1) < prompts.length && !prompts[index + 1].match(repeatRgx); 

    //remove repeat count from prompt
    const trimmedPrompt = prompt.replace(repeatRgx, '').trim().replace("|", ''); 
  
    if (repeatMatch) {
      const repeatCount = parseInt(repeatMatch[2]);
      const trimmedPrevPrompt = prompts[index - 1].replace(repeatRgx, '').trim().replace("|", '');
      //add previous prompt to list n times
      for (let i = 0; i < repeatCount; i++) {
        processedPrompts.push(trimmedPrevPrompt);
      }

      if (nextRepeatMatch) {
        processedPrompts.push(trimmedPrompt);
      }
    
    if (index === prompts.length-1 ) { 
        processedPrompts.push(trimmedPrompt);
    }

    } else if (nextRepeatMatch || index === prompts.length-1) { 
      processedPrompts.push(trimmedPrompt);
    }
  });


  processedPrompts = processedPrompts.filter((prompt) => prompt.trim());
  return processedPrompts;
};

export const convertContentToMarkdown = async (content) => {
  const results = await Promise.all(content.map(async item => {
    if (item.type === 'text') {
      return item.text;
    } else if (item.type === 'image_url') {
      let image_url = item.image_url.url;
       // Check if the image is in WebP format
       if (item.file_type === 'image/webp') {
        // Convert the image to JPEG format
        const downloadUrl = await getBase64Image(item.id, item.file_type);
        const pngBase64 = await convertWebpToPng(downloadUrl);
        image_url = pngBase64;
      } else if (item.id) {
        image_url = await getBase64Image(item.id, item.file_type);
      }
      return `![Image](${image_url})`;
    } else {
      return '';
    }
  }));
  return results.join('\n\n');
};

export async function fetchAndEncodeImageToBase64(url) {
  try {
    // Axios GET request to fetch the image as a buffer
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    // Convert the buffer to a base64 string
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');

    // Return the base64 encoded string
    return base64Image;
  } catch (error) {
    throw error;
  }
}


export const getBase64Image = async (id, file_type) => {
  const url = await getDownloadUrl(id);

  if (file_type === 'image/webp') {
    return url;
  } else {
    let base64 = "";
    await fetchAndEncodeImageToBase64(url)
      .then(base64Image => {
        base64 = `data:image/png;base64,${base64Image}`
      })
      .catch(error => {
        // Handle errors here
        console.log("Error: ", error);
        return null;
      });

    return base64;
  }
}