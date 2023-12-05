"use client"
import { useState, Fragment, useEffect } from 'react'
import { Input, TextArea } from '../FormElements'
import FormModal from '../FormModal'
import { UseTranslation } from '@/app/i18n/client';
import {useParams} from "next/navigation";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Add = ({ open, setOpen }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const [responseMessage, setResponseMessage] = useState(null);
  const [inputType, setInputType] = useState("textbox");
  const [keys, setKeys] = useState([]);

  const handleInputType = (event, newType) => {
    if (newType !== null) {
      setInputType(newType);
    }
  };

  const onSubmit = async (data) => {
    let list_data = [];
    if (inputType === "textbox") {
      let key_values = [];
      keys.forEach((key) => {
        const valuesArr = data[key].split(",").map((value) => value.trim()).filter((value) => value !== "");
        key_values.push({ key: key, values: valuesArr });
      });
      
      let maxLength = Math.max(...key_values.map((kv) => kv.values.length));

      let list = [];
      for (let i = 0; i < maxLength; i++) {
        let obj = {};
        key_values.forEach((kv) => {
          if (kv.values[i]) {
            obj[kv.key] = kv.values[i];
          }
        });
        list.push(obj);
      }

      list_data = list;
    } else if (inputType === "json") {
      try {
        list_data = JSON.parse(data.json);
      } catch (error) {
        console.log(error);
        setResponseMessage(<p className="text-red-500">{t("invalid JSON")}</p>);
        return false;
      }
    }

    const user_list = {
      list_name: data.name,
      list_data: list_data,

    }
    const response = await fetch("/api/powerflow/user-list/new", {
      method: "POST",
      body: JSON.stringify(user_list),
    });
    
    const resData = await response.json();
    
    if (resData.status_code !== 200) {
      console.log("error", resData);
      setResponseMessage(<p className="text-red-500">{t("errorMessage")}</p>);
      return false;
    } else {
      setResponseMessage(<p className="text-green-500">{`${t("list")} ${t("addSuccess")}`}</p>);
      return true;
    }
  };

  useEffect(() => {
    setKeys([]);
    setResponseMessage(null);
  }, [open]);


  return (
    <FormModal open={open} setOpen={setOpen} onSubmit={onSubmit} title={`${t("add")} ${t("list")}`}>
      <Input
      name="name"
      label={t("list name")}
      validation={{ required: `${t("list name")} ${t("itemRequired")}` }}
    />
    <div className='flex justify-between mt-4 flex-col md:flex-row gap-2'>
      <ToggleButtonGroup
      size='small'
      value={inputType}
      exclusive
      onChange={handleInputType}
      aria-label='input type'
    >
      <ToggleButton value="textbox" className='toggle-button'>
        {t("textbox")}
      </ToggleButton>
      <ToggleButton value="json" className='toggle-button'>
        JSON
      </ToggleButton>
    </ToggleButtonGroup>
    </div>
    {inputType === "textbox" ? (
      <>
        <Input
          name="keys"
          label={`${t("variable names")}`}
          placeholder={t("placeholders.variableName")}
          validation={{ required: `${t("variable")} ${t("itemRequired")}` }}
          onChange={(value) => {
            if (value) {
              let keys = value.split(",");
              keys = keys.map((key) => key.trim());
              //filter out empty strings
              setKeys(keys.filter((key) => key));
            } else {
              setKeys([]);
            }
          }}
        />
        {keys.length > 0 ? (
          keys.map((key, index) => {
            return (
              <TextArea
                key={key}
                name={key}
                label={`${key.charAt(0).toUpperCase()}${key.slice(1)} - ${t("values")}`}
                validation={{ required: `${t("value")} ${t("itemRequired")}` }}
                placeholder={`${t("placeholders.textbox")}\n${key},\n${key},\n${key},`}
              />
            );
          })
        ) : (
          <p>{t("please enter variable")}</p>
        )}
      </>
    ) : inputType === "json" ? (
      <>
        <TextArea
          name="json"
          label="JSON"
          validation={{ required: `${t("value")} ${t("itemRequired")}` }}
          placeholder={t("placeholders.json")}
        />
      </>
    ) : null}

     {responseMessage}                              
    </FormModal>
  )
}

export default Add
