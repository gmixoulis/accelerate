"use client";
import MessageBubble from "./MessageBubble";
import { Virtuoso } from 'react-virtuoso';
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"
import { useState, useEffect } from "react";
import { OpenAIModel } from "../../utils/constants";
import { getDownloadUrl } from "../../utils/fileServices";

export default function DisplayMessages({prompt}) {
    const chat_json = prompt.chat_json;
    const refreshToken = Cookies.get("refreshToken");
    const userId = refreshToken ? jwt_decode(refreshToken).UserID : "";
    const isPromptOwner = userId === parseInt(prompt.user_id);

    const [publicUrls, setPublicUrls] = useState([]);

    useEffect(() => {
        const getPublicUrls = async () => {
            const promises = chat_json
                .filter(message => message.role === "user")
                .flatMap(message => message.content.filter(item => item.id))
                .map(async item => {
                    const url = await getDownloadUrl(item.id, false);
                    return { id: item.id, url };
                });

            const urls = await Promise.all(promises);
            setPublicUrls(urls);
        };

        if (!isPromptOwner && prompt.model === OpenAIModel.GPT_4_TURBO_VISION.model) {
            getPublicUrls().catch(error => console.error(error));
        }
    }, []);

    return (
        <Virtuoso
            overscan={400}
            style={{height: "calc(100vh - 200px)", marginRight: "-1rem"}}
            data={chat_json}
            itemContent={(index, message) => {
                return (
                    <div className="mb-4">
                        <MessageBubble message={message} model={prompt.model} index={index} prompt={prompt} isPromptOwner={isPromptOwner} publicUrls={publicUrls} />
                    </div>
                )
            }}
        />
    );

}