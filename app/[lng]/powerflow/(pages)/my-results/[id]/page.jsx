import Header from "../../../components/Full Conversation/Header";
import { cookies } from 'next/headers'
import jwt_decode from "jwt-decode"
import { UseTranslation } from "@/app/i18n";
import LogError from "../../../components/LogError";
import { getPrompt } from "../../../utils/powerflow-api/prompt-response";
import { Danger, Info } from "../../../components/Alerts";
import { getDisplayName } from "../../../utils";
import DisplayMessages from "../../../components/Full Conversation/DisplayMessages";

export default async function Page({ params }) {
    const lng = params.lng;
    const { t } = await UseTranslation(lng, "powerflow");
    const refreshToken = cookies().get("refreshToken")?.value;
    const userId =  refreshToken ? jwt_decode(refreshToken).UserID : "";
    let info;

    const response = await getPrompt(params.id, userId);

    if (response.status_code !== 200) {
        return (
             <div className="min-h-[80vh] 3xl:min-h-[85vh]">
            <div className="flex flex-col ml-5 md:max-w-[80%]">
            <Danger title={`${t("fetchError", {item: t("task")})}:`} message={response.message} />
            <LogError status={response.status} data={JSON.stringify(response.data)} />
            </div>
            </div>
        )
    } else {
      const prompt = response.data[0];
      let chat_arr = JSON.parse(prompt.chat_json);
      const isPromptOwner = userId === parseInt(prompt.user_id);
      
      // Remove system message
      if (chat_arr?.length > 0 && chat_arr[0].role === "system") { 
        chat_arr = chat_arr.slice(1);
      }

      prompt.chat_json = chat_arr;
      const modelName = getDisplayName(prompt.model);

      let status;

      if (prompt?.status === "in progress") {
        status = t("statusMessage.inProgress")
      } else if (prompt?.status === "in queue") {
        status = t("statusMessage.inQueue")
      } else if (prompt?.status === "failed") {
        status = t("statusMessage.failed")
      } else if (prompt?.status === "retrying") {
        status = t("statusMessage.retrying")
      } else {
        status = null;
      }

      // Check if chat_json is empty
      if (!prompt.chat_json) {
        prompt.chat_json = [];
        info = t("empty chat_json");
      }
    

      // Add conversational style to first message
      if (prompt.chat_json && prompt.chat_json.length > 0 && prompt.chat_json[0].content) {
        prompt.chat_json[0].content = prompt.chat_json[0].content.replace(new RegExp(`(${t("you")}:|${modelName}:)`, 'g'), '\n\n**$1**\n\n');
      }

      return (
          <>
              <div className="flex flex-col w-full h-full">
                  <Header prompt={prompt} isPromptOwner={isPromptOwner}/>
                  {
                    info && (
                      <div className="lg:max-w-[60%]">
                        <Info title={`${t("info")}:`} message={info} />
                      </div>
                    )
                  }
                  {prompt?.chat_json && prompt?.chat_json.some(message => message.role) && (
                    <DisplayMessages prompt={prompt} />
                  )}
                  {prompt?.status !== "done" && 
                    <div className="mb-3 text-gray-800 bg-gray-200 message-bubble custom-box assistant-message">
                    {status}
                    </div> 
                  } 
              </div>
          </>
      )
  }
}

