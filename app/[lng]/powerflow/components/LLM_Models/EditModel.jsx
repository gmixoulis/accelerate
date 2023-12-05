"use client"
import { Input, TextArea } from '../FormElements'
import FormModal from '../FormModal'
import { useState } from 'react';
import { UseTranslation } from '@/app/i18n/client';
import {useParams} from "next/navigation";
import { useEffect } from 'react';



const Edit = ({ open, setOpen, initialValues}) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");


  const [responseMessage, setResponseMessage] = useState(null);

  const onSubmit = async (data) => {
    console.log(data);
    const response = await fetch(`/api/powerflow/llm-model/${initialValues.model_id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    
    const resData = await response.json();
    console.log(resData);
    
    if (resData.status_code !== 200) {
      setResponseMessage(<p className="text-red-500">{t("errorMessage")}</p>);
      return false;
    } else {
      setResponseMessage(<p className="text-green-500">{`${t("model")} ${t("editSuccess")}`}</p>);
      return true;
    }
  };

  useEffect(() => {
    setResponseMessage(null);
  }, [open]);

  return (
    <FormModal open={open} setOpen={setOpen} initialValues={initialValues} onSubmit={onSubmit} title={`${t("edit")} ${t("model")}`}>
      <Input
      name="name"
      label={t("name")}
      validation={{ required: `${t("name")} ${t("itemRequired")}` }}
    />
     <Input 
        name="api_name"
        label={t("api name")}
        validation={{ required: `${t("api name")} ${t("itemRequired")}` }}
      />

      <TextArea
       name="description"
       label={t("description")}
       validation={{required: false}}
     />              

     {responseMessage}                                         
    </FormModal>
  )
}

export default Edit
