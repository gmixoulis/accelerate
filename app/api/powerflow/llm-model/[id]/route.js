import { NextResponse } from "next/server";
import { editModel, deleteModel } from "@/app/[lng]/powerflow/utils/powerflow-api/llm-models";

export async function PUT(req) {
    const llm_model = await req.json();

    try {
        const response = await editModel(llm_model);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in POST: ", err);
        return NextResponse.json({err}, { status: 500 });
    }

}

export async function DELETE(req, {params}) {
    const id = params.id;
    console.log("id: ", id);

    try {
        const response = await deleteModel(id);
        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error in DELETE: ", err);
        return NextResponse.json({err}, { status: 500 });
    }
}