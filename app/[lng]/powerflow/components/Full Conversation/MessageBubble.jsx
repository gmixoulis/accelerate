"use client";
import MarkdownMessage from "../Chat/MarkdownMessage";
import ExportBtn from "../Chat/ExportBtn";
import CopyBtn from "../Chat/CopyBtn";
import ForkBtn from "./ForkBtn";
import { OpenAIModel } from "../../utils/constants";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { getDisplayName } from "../../utils";

export default function MessageBubble({ message, model, index, prompt, isPromptOwner, publicUrls }) {
    const messageWithModel = { ...message, model };
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");
    const modelName = getDisplayName(model);

    return (
        <div className="max-w-[80vw] md:max-w-[85%]">
            <div
                className={`message-bubble custom-box ${message.role === "assistant"
                    ? "bg-gray-200 text-gray-800 assistant-message"
                    : "bg-dimgray-200 text-gray-800 user-message text-white"
                    }`}
            >
                <div className="message-header">
                    {message.role === "assistant" ? modelName : t("you")}
                    <div className="flex items-center gap-2">
                        <ExportBtn message={messageWithModel} />
                        <CopyBtn message={messageWithModel} />
                        <ForkBtn prompt={prompt} index={index} />
                    </div>
                </div>
                <div className="message-content break-words">
                    {message.role === "assistant" || (index === 0) ? (
                        <MarkdownMessage message={message.content} />
                    ) : (
                        <div className="whitespace-pre-wrap break-words">
                            {
                                message.model === OpenAIModel.GPT_4_TURBO_VISION.model ? (
                                    <>
                                        {message.content[0].text}
                                        {message.content.map((item, index) => {
                                            if (item.type === 'image_url') {
                                                if (isPromptOwner) {
                                                    return <img key={index} src={item.image_url.url} alt="Image" className="my-4" />;
                                                } else {
                                                    let url;
                                                    if (item.id) {
                                                        const urlObject = publicUrls.find(url => url.id === item.id);
                                                        if (urlObject && urlObject.url) {
                                                            url = urlObject.url;
                                                        }
                                                    } else {
                                                        url = item.image_url.url;
                                                    }
                                                    return <img key={index} src={url} alt="Image" className="my-4" />;
                                                }
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </>
                                ) : (message.content)
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}