import { OpenAIModel, getMaxTokens } from "../../utils/constants"
import { useStream } from "../../context/StreamContext";
import { useEffect, useState } from "react";
import { fetchTokens } from "../../utils";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

const MessageDetails = ({ message }) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const { model, messages, shouldUpdate } = useStream();
    const [showDetails, setShowDetails] = useState(false);
    const [inputTokens, setInputTokens] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);
    const [prevMessagesLength, setPrevMessagesLength] = useState(0);

    useEffect(() => {
        const text = messages.map(message => message.content).join(" ");
        fetchTokens(model, text).then(count => {
            setTotalTokens(count);
        });
    }, []);

    //Update total tokens when messages gets updated
    useEffect(() => {
        if (messages.length === 1) {
            fetchTokens(model, messages[0].content).then(count => {
                setTotalTokens(count);
            });
        } else {
            // Check if the length of messages is the same as the previous length
            if (messages.length !== prevMessagesLength) {
                const lastMessage = messages[messages.length - 1];
                if ((lastMessage.role === "assistant" && shouldUpdate) || (lastMessage.role === "user" && !shouldUpdate)) {
                    let content = lastMessage.content;
                    if (lastMessage.role === "user" && model === OpenAIModel.GPT_4_TURBO_VISION.model) {
                        content = lastMessage.content[0].text;
                    }
                    fetchTokens(model, content).then(count => {
                        setTotalTokens(totalTokens + count);
                        // Update the previous length of messages
                        setPrevMessagesLength(messages.length);
                    });
                }
            }
        }
    }, [messages, shouldUpdate, model]);


    useEffect(() => {
        fetchTokens(model, message).then(count => {
            setInputTokens(count);
        });
    }, [message, model]);

    const progress = ((totalTokens + inputTokens) / getMaxTokens(model)) * 100;

    return (
        <div className="mt-2 flex items-center gap-3 text-gray-800 dark:text-gray-300">
            <button
                className="text-sm font-medium text-blue-600 dark:text-blue-500"
                onClick={() => setShowDetails(!showDetails)}
            >
                {showDetails ? t("hide token details") : t("show token details")}
            </button>
            {showDetails && (
                <>
                    <div className="text-lg font-bold">{t("approximate tokens")}:</div>
                    <div className="w-[50%] max-w-[50%] my-2 h-6 bg-gray-300 rounded-full dark:bg-gray-700">
                        <div className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-sm font-medium text-blue-100 text-center p-0.5 leading-none" style={{ width: `${progress > 100 ? 100 : progress}%` }}>
                            {progress.toFixed(1)}%
                        </div>
                    </div>

                    {(totalTokens + inputTokens).toLocaleString()} / {getMaxTokens(model).toLocaleString()} {t("tokens used")}
                </>
            )}
        </div>
    );
};

export default MessageDetails;