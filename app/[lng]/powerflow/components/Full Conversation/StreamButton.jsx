"use client"

import { IconMessage } from "@tabler/icons-react";
import { useStream } from "../../context/StreamContext";
import { useRouter, useParams } from "next/navigation";
import { UseTranslation } from "@/app/i18n/client";
import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { getChatId } from "../../utils";
import { AlertOverlay } from "../Overlay";

const StreamButton = ({ prompt, isPromptOwner }) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", show: false });
    const [notPromptOwnerAlert, setNotPromptOwnerAlert] = useState({ message: "", show: false });

    const {
        setMessages,
        setChatId,
        setStreamTitle,
        setModel,
        setActiveTab,
    } = useStream();

    const router = useRouter();


    const messages = prompt.chat_json.map((conversation) => {
        return {
            role: conversation.role,
            content: conversation.content,
            model: prompt.model,
        }
    });

    const newChatId = async () => {
        try {
            const chatId = await getChatId();
            return chatId;
        } catch (error) {
            console.log(error);
            setAlert({ message: `${t("chatIdFailed.title")}. ${t("chatIdFailed.message")}`, show: true });
            return null;
        }
    }

    return (
        <>
            <button className="cursor-pointer flex items-center justify-center gap-2 primary-button font-light p-2 rounded-md w-28 text-gray-100 border border-transparent border-1 dark:border-gainsboro-400"
                onClick={async () => {
                    if (!isPromptOwner && prompt.mode === "stream") {
                        setNotPromptOwnerAlert({message: `${t("not owner")}`, show: true});
                        return;
                    }
                    setLoading(true);
                    if (prompt.mode === "stream") {
                        setChatId(prompt.chat_id);
                        setMessages(messages);
                    } else {
                        try {
                            const chatId = await newChatId();

                            if (!chatId) {
                                throw new Error("ChatId failed");
                            }

                            setChatId(chatId);
                            const newMessages = [
                                {
                                    role: "assistant",
                                    content: t("initialMessage"),
                                    model: prompt.model,
                                },
                                ...messages
                            ];

                            setMessages(newMessages);
                            //Save chat body
                            const requestBody = { chatId: chatId, title: prompt.title, model: prompt.model, messages: newMessages }
                            const response = await fetch("/api/powerflow/update-thread", {
                                method: "POST",
                                body: JSON.stringify(requestBody)
                            });

                            const data = await response.json();
                            console.log(data);
                        } catch (error) {
                            console.log(error);
                            //setAlert({message: ``, show: true});
                            setLoading(false);
                            return;
                        }
                    }


                    setStreamTitle(prompt.title);
                    setModel(prompt.model);
                    setActiveTab("stream");

                    //set scroll to bottom
                    const scrollPositions = JSON.parse(localStorage.getItem("scrollPositions")) || {};
                    scrollPositions.stream = Number.MAX_SAFE_INTEGER;
                    localStorage.setItem("scrollPositions", JSON.stringify(scrollPositions));

                    setLoading(false);
                    router.push(`/${lng}/powerflow`);
                }}>
                {loading ? <IconLoader2 className="h-5 w-5 text-white" /> : <IconMessage className="h-5 w-5 text-white" />}
                {t("stream")}

            </button>
            <AlertOverlay type="danger" message={alert.message} isOpen={alert.show} setIsOpen={(show) => setAlert({ ...alert, show })} />
            <AlertOverlay type="info" message={notPromptOwnerAlert.message} isOpen={notPromptOwnerAlert.show} setIsOpen={(show) => setNotPromptOwnerAlert({ ...notPromptOwnerAlert, show })} />
        </>
    )
}

export default StreamButton;