"use client"
import Table from "./Table";
import Delete from "../Delete";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UseTranslation } from "@/app/i18n/client";
import Add from "./AddProfile";
import Edit from "./EditProfile";


const Profiles = ({data}) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [edit, setEdit] = useState({});
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const TABLE_HEAD = [
        { 
            id: "name",
            name: t("name") 
        },
        { 
            id: "description",
            name: t("description") 
        },
        {
            id: "system_prompt",
            name: t("system prompt"),
        },
        {
            id: "status",
            name: t("status"),
        }
    ]

    return (
        <>
            <Table 
                TABLE_HEAD={TABLE_HEAD}
                total={data.length} 
                setShowModal={setShowModal}
                setShowEdit={setShowEdit}
                setShowDelete={setShowDelete}
                setItem={setEdit}
                name={t("profile")}
                data={data}
                properties={["name", "description", "system_prompt", "status"]}
            />

            <Add open={showModal} setOpen={setShowModal} />
            <Edit open={showEdit} setOpen={setShowEdit} initialValues={edit}/>
            <Delete  
            open={showDelete} 
            onClose={() => {
                setShowDelete(false);
                setError(null);} }
            onDelete={async () => {
               
            }} 
            errorMessage={error}
            deleting={deleting}
            />
        </>
    )

}

export default Profiles