import { BACKEND_URL } from "@/server";
import axios from "axios";
import { cookies } from 'next/headers'

export default async function getDownloadUrl(id) {
    const refreshToken = cookies().get('refreshToken')?.value;

    try {
        const response = await axios.post(
            BACKEND_URL + `powerflow/download-request`,
            {
                FileID: id,
                DownloadAsAttachment: true,
            },
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        throw err;
    }
}

