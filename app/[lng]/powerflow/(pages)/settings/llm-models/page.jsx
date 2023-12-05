import LLM_Models from "../../../components/LLM_Models/LLM_Models";
import { getModels } from "../../../utils/powerflow-api/llm-models";
import { UseTranslation } from "@/app/i18n";
import LogError from "../../../components/LogError";

export default async function Page({params}) {
  const { t } = await UseTranslation(params.lng, "powerflow");

  const response = await getModels("openai");

  if (response.status_code === 200 || response.status_code === 404) {
    let data = [];
    if (response.status_code === 200) {
      data = response.data;
    }
    return <LLM_Models data={data} />;
  } else {
    return (
      <div className="flex flex-col ml-5">
      <h1>{t("fetchError", {item: t("model")})}</h1>
      {response.message && <p>{`${t("error")}: ${response.message}`}</p>}
      <LogError status={response.status} data={JSON.stringify(response.data)} />
      </div>
    )
  }
}
