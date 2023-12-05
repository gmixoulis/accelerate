import { NextResponse } from "next/server";
import { addModel } from "@/app/[lng]/powerflow/utils/powerflow-api/llm-models";

export async function POST(req) {
    const llm_model = await req.json();
    console.log("llm_model: ", llm_model);

    try {
        const response = await addModel(llm_model);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in POST: ", err);
        return NextResponse.json({err}, { status: 500 });
    }

}