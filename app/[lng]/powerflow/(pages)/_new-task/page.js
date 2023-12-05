"use client"
import Form from "../../components/Form";
import { Input, Select, TextArea } from "../../components/FormElements";
import { useState, useEffect } from "react";
import { UseTranslation } from "@/app/i18n/client"
import Success from "../../components/Batch/Success";
import { Danger } from "../../components/Alerts";
import { IconLoader2 } from "@tabler/icons-react";
import { processPrompts } from "../../utils";
import { OpenAIModel } from "../../utils/constants";
import MultipleSelect from "../../components/New Task/MultipleSelect";
import ListAccordion from "../../components/New Task/Accordion";
import Link from "next/link";
import { Trans } from "react-i18next";

export default function Page({params}) {
    const { t } = UseTranslation(params.lng, "powerflow");

    const [template, setTemplate] = useState("");
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [pairs, setPairs] = useState([{ key: "", value: "" }]);
    const [selectedList, setSelectedList] = useState({});
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        //Get lists
        fetch("/api/powerflow/user-list", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status_code !== 200) {
                    throw data;
                }
                setLists(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    async function onSubmit(data) {
        setIsSubmitting(true);

        //Replace {{key}} with value in template
        const processedTemplate = data.template.replace(/{{(.*?)}}/g, (match, p1) => {
            const variable = pairs.find((pair) => pair.key === p1);
            return variable ? variable.value : match;
        });

        const prompts = processPrompts(processedTemplate);
        const prompt = { 
            user_prompts: prompts, 
            processing_mode: data.mode,
            title: data.title.trim() === "" ? prompts[0].substring(0, 201) : data.title.trim().substring(0, 201), 
            model: data.model
          };
          
        try {
          const response = await fetch("/api/powerflow/prompt/new", {
            method: "POST",
              body: JSON.stringify({
                prompt: prompt,
              }),
            });

       
            const body = await response.json();

            if (body.status_code === 201) {
              setIsSubmitting(false);
              setSuccess(true);
            } else {
              console.log("error:", body)
              throw {error: body}
            }
            
          } catch (error) {
            console.log(error);
            setIsSubmitting(false);
            setError(t("sendFailed"));
          }

        const resetBtn = document.querySelector("button[type='reset']");
        resetBtn.click();
    }

    return (
        <div className="mt-6 md:max-w-[90%] mx-auto">
            <Form onSubmit={(data) => onSubmit(data)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="w-full flex flex-col gap-6">
                            <Input
                                name="title"
                                label={t("title")}
                                validation={{ required: `${t("title")} ${t("itemRequired")}` }}
                            />
                            <div className="flex gap-6">
                                <Select
                                    name="mode"
                                    label={t("mode")}
                                    options={[
                                        {
                                            value: "sequential",
                                            label: t("sequential"),
                                        },
                                        {
                                            value: "parallel",
                                            label: t("parallel"),
                                        },
                                    ]}
                                    validation={{ required: `Mode ${t("itemRequired")}` }}
                                />
                                <Select
                                    name="model"
                                    label={t("model")}
                                    options={[
                                        {
                                            value: OpenAIModel.GPT_4.model,
                                            label: "GPT-4",
                                        },
                                        {
                                            value: OpenAIModel.GPT_3.model,
                                            label: "GPT-3.5",
                                        }
                                    ]}
                                    validation={{ required: `Model ${t("itemRequired")}` }}
                                />
                            </div>
                            <TextArea
                                name="template"
                                label={t("template")}
                                placeholder={t("placeholders.template")}
                                validation={{ required: `${t("template")} ${t("itemRequired")}` }}
                                rows={5}
                                onChange={(newTemplate) => setTemplate(newTemplate)}
                                value={template}
                            />
                        </div>
                    <div className="flex flex-1 flex-col gap-9">
                        <div>
                            <h2 className="text-xl text-gray-700 dark:text-gray-200 mb-2">{t("lists")}</h2>
                            {loading ? (
                                <div className="bg-gray-100 dark:bg-gray-700 animate-pulse rounded-md w-56 h-9"></div>
                            ) : (
                                lists.length === 0 ? (
                                    <Trans
                                        i18nKey="powerflow:noLists"
                                        values={{link: t("create list")}}
                                        components={[
                                            <Link href={`/${params.lng}/powerflow/settings/user-lists`} className="underline hover:text-red-300" />
                                        ]}
                                    />
                                ) : (
                                    <MultipleSelect options={lists} selected={selectedList} setSelected={setSelectedList} displayValue="list_name" />
                                )
                            )
                            }
                        </div>
                        {selectedList?.list_name &&
                            <ListAccordion list={selectedList} />
                        }
                    </div>
                    <div className="md:justify-self-end flex flex-col flex-col-reverse md:flex-row md:flex-row-reverse gap-4 md:col-span-2 md:gap-2">
                        <button
                            disabled={true}
                            type="submit"
                            className="inline-flex justify-center w-full px-3 py-2 font-semibold text-white rounded-md shadow-sm bg-dimgray-200 hover:bg-dimgray-100 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {isSubmitting ? <IconLoader2 className="w-5 h-5 text-white animate-spin" /> : t("submit")}
                        </button>
                        <button
                        type="reset"
                        className="inline-flex justify-center w-full px-3 py-2 mt-3 text-gray-800 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:hover:bg-gray-200 sm:mt-0 sm:w-auto"
                        onClick={() => {
                            setPairs([{ key: "", value: "" }]);
                            setTemplate("");
                        }}
                    >
                        {t("reset")}
                    </button>
                    </div>
                </div>
                { 
                  error &&
                  <div className="mt-2 flex justify-center lg:max-w-[60%] mx-auto">
                  <Danger title={`${t("error")}:`} message={error} onClose={() => {
                      setError(null);
                  }}/>
                  </div>
                }
               <Success success={success} setSuccess={setSuccess} />
            </Form>   
        </div>
    )
}

