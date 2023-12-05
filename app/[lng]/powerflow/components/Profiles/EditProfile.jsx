"use client"
import { Input, TextArea } from '../FormElements'
import FormModal from '../FormModal'
import { useState } from 'react';
import { UseTranslation } from '@/app/i18n/client';
import {useParams} from "next/navigation";



const Edit = ({ open, setOpen, initialValues}) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");


  const [responseMessage, setResponseMessage] = useState(null);

  const onSubmit = async (data) => {
    
  };

  return (
    <FormModal open={open} setOpen={setOpen} initialValues={initialValues} onSubmit={onSubmit} title={`${t("edit")} ${t("profile")}`}>
      <Input
      name="name"
      label={t("name")}
      validation={{ required: `${t("name")} ${t("itemRequired")}` }}
    />
      <TextArea
       name="description"
       label={t("description")}
       validation={{required:  `${t("description")} ${t("itemRequired")}` }}
     />              
   <TextArea
       name="system_prompt"
       label={t("System prompt")}
       validation={{required:  `${t("System prompt")} ${t("itemRequired")}` }}
     />  
     {responseMessage}                                         
    </FormModal>
  )
}

export default Edit
