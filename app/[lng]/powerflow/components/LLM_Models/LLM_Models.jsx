"use client"
import Table from "../Settings/Table";
import Add from "./AddModel";
import Edit from "./EditModel";
import Delete from "../Delete";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UseTranslation } from "@/app/i18n/client";


const LLM_Models = ({data}) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [edit, setEdit] = useState({});
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const router = useRouter();

    const TABLE_HEAD = [
        { 
            id: "name",
            name: t("name") 
        },
        { 
            id: "api_name",
            name: t("api name") 
        },
        // {
        //     id: "active",
        //     name: t("active"),
        // }
    ]

    return (
        <>
            <Table 
                TABLE_HEAD={TABLE_HEAD}
                setShowModal={setShowModal}
                setShowEdit={setShowEdit}
                setShowDelete={setShowDelete}
                setItem={setEdit}
                name={t("model")}
                data={data}
                properties={["name", "api_name"]}
                id="model_id"
            />

            <Add open={showModal} setOpen={setShowModal} />
            <Edit open={showEdit} setOpen={setShowEdit} initialValues={edit}/>
            <Delete  
            open={showDelete} 
            onClose={() => {
                setShowDelete(false);
                setError(null);} }
            onDelete={async () => {
                setDeleting(true);
                const response = await fetch(`/api/powerflow/llm-model/${edit.model_id}`, {
                    method: "DELETE"
                    });
                const resData = await response.json();
                const success = resData.status_code === 200;
                console.log(resData);
                if (success) {
                    setShowDelete(false);
                } else {
                    console.log("error", resData)
                    setError(t("deleteFailed"));
                }
                router.refresh();
                setDeleting(false);
            }} 
            errorMessage={error}
            deleting={deleting}
            />
        </>
    )

}

export default LLM_Models