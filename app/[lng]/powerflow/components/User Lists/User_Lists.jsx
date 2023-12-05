"use client"
import Table from "../Settings/Table";
import Add from "./AddList";
import Edit from "./EditList";
import Delete from "../Delete";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UseTranslation } from "@/app/i18n/client";
import { useMemo } from "react";


const User_Lists = ({data}) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [edit, setEdit] = useState({});
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const router = useRouter();

    const TABLE_HEAD = useMemo(() => [
        { 
            id: "list_name",
            name: t("list name") 
        },
        { 
            id: "created_at",
            name: t("created at") 
        },
        { 
            id: "updated_at",
            name: t("updated at") 
        }
    ], [t]);

    return (
        <>
            <Table 
                TABLE_HEAD={TABLE_HEAD}
                setShowModal={setShowModal}
                setShowEdit={setShowEdit}
                setShowDelete={setShowDelete}
                setItem={setEdit}
                name={t("list")}
                data={data}
                properties={["list_name", "created_at", "updated_at"]}
                id={"list_id"}
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
                const response = await fetch(`/api/powerflow/user-list/${edit.list_id}`, {
                    method: "DELETE"
                    });
                const resData = await response.json();
                const success = resData.status_code === 200;
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

export default User_Lists