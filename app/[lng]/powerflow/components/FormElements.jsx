import { useFormContext } from "react-hook-form"
import { BsExclamationTriangle } from "react-icons/bs";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { AiFillCaretDown } from "react-icons/ai";
import autosize from "autosize";
import { useRef, useEffect, useState } from "react";


export function Input({
  name, 
  label = null, 
  type = "text", 
  placeholder = "", 
  validation,
  onChange = null,
  value = undefined,
  defaultValue = undefined
}) {
    const params = useParams();
    const lng = params.lng;
    const { t } = UseTranslation(lng, "powerflow");

    const { register, 
        formState: { errors }
     } = useFormContext();

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={name} className="block text-gray-700 dark:text-gray-200">
            {label}
            {!validation.required && (
              <span className="text-gray-400">{` (${t("optional")})`}</span>
            )}
          </label>
        )}
        <input
            type={type}
            value={value}
            id={name}
            className={`p-2 w-full ${errors[name] ? "rounded-md border border-red-500 dark:bg-gray-800 focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-80" : "custom-box"}`}
            placeholder={placeholder || label}
            defaultValue={defaultValue}
            {...register(name, {
                ...validation,
                validate: {
                  required: value => !validation.required || (typeof value === 'string' && value.trim() !== "") ||  `${label ? `${label} ` : ""}${t("itemBlank")}`,
                },
                onChange: (e) => onChange && onChange(e.target.value)
              })}
            />
        {errors[name] && <p className="mt-1 text-sm text-red-100 dark:p-2">
        <BsExclamationTriangle className="inline-block w-4 h-4 mr-1 -mt-1" />
        {errors[name].message}
        </p>}
        </div>
    )
}

import { useImperativeHandle } from "react"


export function TextArea({
  name,
  label = null,
  rows = 3, 
  placeholder = "",  
  validation = {fileOrText: false}, 
  watchFileInput = "",
  onChange = null,
  value = undefined,
  defaultValue = undefined
}) {
  const params = useParams();
  const lng = params.lng;
  const { t } = UseTranslation(lng, "powerflow");
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(value || "");
  const { register,
      formState: { errors }
      } = useFormContext();
  
  useEffect(() => {
    if (textareaRef?.current) {
      autosize(textareaRef.current);
      autosize.update(textareaRef.current);
    }
  }, [currentValue]);

  const { ref, ...rest } = register(name, {
    ...validation,
    validate: {
      required: value => !validation.required || (typeof value === 'string' && value.trim() !== "") || `${label ? `${label} ` : ""}${t("itemBlank")}`,
      fileOrText: value => !validation.fileOrText || (watchFileInput || value.trim() !== "") || t("fileOrText")
    },
    onChange: (e) => {
      setCurrentValue(e.target.value);
      if (onChange) {
        onChange(e.target.value);
      }
    },
  });

  useImperativeHandle(ref, () => textareaRef.current);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="block text-gray-700 dark:text-gray-200">
          {label}
          {!validation.required && <span className="text-gray-400">{` (${t("optional")})`}</span>}
        </label>
      )}
      <textarea
          id={name}
          value={value}
          className={`p-2 w-full ${errors[name] ? "rounded-md border border-red-500 dark:bg-gray-800 focus:border-red-600 focus:ring focus:ring-red-600 focus:ring-opacity-80" : "custom-box"}`}
          placeholder={placeholder || label}
          {...rest}
          ref={textareaRef}
          rows={rows}
          style={{ resize: "none", overflow: "hidden" }} 
          defaultValue={defaultValue}
      />
      {errors[name] && <p className="mt-1 text-sm text-red-100 dark:p-2">
      <BsExclamationTriangle className="inline-block  w-4 h-4 mr-1 -mt-1" />
      {errors[name].message}
      </p>}
    </div>
  )
}


export function Select({name, label, options}) {
  const {
    register,
    formState: {errors }
  } = useFormContext()

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label htmlFor={name} className="block text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <select {...register(name)} className="custom-box p-2 pr-3 appearance-none">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <span className="absolute right-2 top-8 text-gray-700 dark:text-gray-200 pointer-events-none z-10">
        <AiFillCaretDown size={18} />
      </span>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-100 dark:p-2">
          <BsExclamationTriangle className="inline-block w-4 h-4 mr-1 -mt-1" />
          {errors[name].message}
        </p>
      )}
    </div>
  )
}

export function CheckBox({name, text}) {
  const {
    register,
    formState: {errors }
  } = useFormContext()

  return (
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          className="block w-6 h-6 text-lg text-blue-600 border border-gray-200 rounded focus:ring-0 focus:outline-none focus:ring-offset-0 disabled:text-gray-200 disabled:cursor-not-allowed"
          {...register(name)}
        />
        <span className="block ml-4">{text}</span>
      </label>
      {errors[name] && <p className="mt-1 text-sm text-red-100 dark:bg-gray-500 dark:bg-opacity-75 dark:p-2">
        <BsExclamationTriangle className="inline-block  w-4 h-4 mr-1 -mt-1" />
        {errors[name].message}
        </p>}
    </div>
  )
}
