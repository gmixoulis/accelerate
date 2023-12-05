import Table from "../../components/Results_Table/Table";
import jwt_decode from "jwt-decode"
import LogError from "../../components/LogError";
import { UseTranslation } from "@/app/i18n";
import { cookies } from "next/headers";
import { getPrompts } from "../../utils/powerflow-api/prompt-response";
import { Danger } from "../../components/Alerts";

export default async function Page({params, searchParams}) {
   const lng = params.lng;
   const { t } = await UseTranslation(lng, "powerflow");
   const { page, pageSize, status, mode, search, startDate, endDate } = searchParams;

   const refreshToken = cookies().get("refreshToken")?.value;
   const userId =  refreshToken ? jwt_decode(refreshToken).UserID : "";
   const response = await getPrompts({
         page: page || 1,
         pageSize: pageSize || 50,
         status: status || "",
         mode: mode || "",
         search: search || "",
         startDate: startDate || "",
         endDate: endDate || "",
   }, userId);

   if (response.status_code === 200 || response.status_code === 404) {
      let prompts = [];
      let total = 0;
      if (response.status_code === 200) {
         const data = response.data;
         total = data[0].total_records;
         
         prompts = data.slice(1);

         // // Group parallel prompts into batches
         // const parallelBatchMap = new Map();
         // prompts.forEach(prompt => {
         //    if (prompt.mode === "parallel" && prompt.batch_id) {
         //       if (parallelBatchMap.has(prompt.batch_id)) {
         //          parallelBatchMap.get(prompt.batch_id).push({...prompt});
         //       } else {
         //          parallelBatchMap.set(prompt.batch_id, [{...prompt}]);
         //       }
         //    }
         // });

         // const seenBatchIds = new Set();
         // prompts = prompts.filter(prompt => {
         //    if (prompt.mode === "parallel" && prompt.batch_id) {
         //       if (seenBatchIds.has(prompt.batch_id)) {
         //          return false;
         //       } else {
         //          prompt.batch = parallelBatchMap.get(prompt.batch_id);
         //          seenBatchIds.add(prompt.batch_id);
         //          return true;
         //       }
         //    } else {
         //       return true;
         //    }
         // });

         

      }
      return (
         <Table tasks={prompts} total={total}/>
      )
   } else {
      
      return (
         <div className="flex flex-col ml-5">
         <Danger title={`${t("fetchError", {item: t("tasks")})}:`} message={response.message} />
         <LogError status={response.status || response.status_code} data={JSON.stringify(response.data)} />
         </div>
      )
   }
}

