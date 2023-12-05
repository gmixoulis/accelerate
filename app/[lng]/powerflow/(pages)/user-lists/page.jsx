import User_Lists from "../../components/User Lists/User_Lists";
import { getLists } from "../../utils/powerflow-api/user-lists";
import { UseTranslation } from "@/app/i18n";
import LogError from "../../components/LogError";
import { cookies } from "next/headers";
import jwt_decode from "jwt-decode";
import { formatDate } from "../../utils";

export default async function Page({params}) {
    const { t } = await UseTranslation(params.lng, "powerflow");

    const refreshToken = cookies().get("refreshToken")?.value;
    const userId =  refreshToken ? jwt_decode(refreshToken).UserID : "";

    const response = await getLists(userId);

    if (response.status_code === 200 || response.status_code === 404) {
        let data = [];
        if (response.status_code === 200) {
          data = response.data;
        }

        data = data.map((item) => {
          return {
              ...item,
              created_at: formatDate(item.created_at),
              updated_at: formatDate(item.updated_at)
          }
      }
      );
        return <User_Lists data={data} />;
      } else {
        return (
          <div className="flex flex-col ml-5">
          <h1>{t("fetchError", {item: t("user-lists")})}</h1>
          {response.message && <p>{`${t("error")}: ${response.message}`}</p>}
          <LogError status={response.status} data={JSON.stringify(response.data)} />
          </div>
        )
      }
    }
    