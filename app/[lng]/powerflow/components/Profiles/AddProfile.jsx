"use client"
import { useState } from 'react'
import { Input, TextArea } from '../FormElements'
import FormModal from '../FormModal'
import { UseTranslation } from '@/app/i18n/client';
import {useParams} from "next/navigation";



const Add = ({ open, setOpen }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const [responseMessage, setResponseMessage] = useState(null);

  const onSubmit = async (data) => {
    
  };

  return (
    <FormModal open={open} setOpen={setOpen} onSubmit={onSubmit} title={`${t("add")} ${t("profile")}`}>
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
       placeholder='System prompt'
       validation={{required:  `${t("system prompt")} ${t("itemRequired")}` }}
     />  
     {responseMessage}                              
    </FormModal>
  )
}

export default Add
