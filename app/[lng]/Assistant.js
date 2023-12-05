"use client"

import { BsThreeDots } from "react-icons/bs"
import { IoChatbubbleSharp } from "react-icons/io5"
import { LiaTimesSolid } from "react-icons/lia"
import { RiLayoutBottomLine, RiLayoutRightLine } from "react-icons/ri"
import Drawer from "react-modern-drawer"

import "react-modern-drawer/dist/index.css"
import ChatHandler from "./components/Assistant/ChatHandler"
import { useAssistant } from "@/context/AssistantContext"
import { OpenAIModel } from "@/app/[lng]/powerflow/utils/constants"



export default function Assistant({ swapDrawer, toggleDrawer, isOpen }) {
  const {
    setMessages, 
    setModel,
    model
  } = useAssistant();

  return (
    <>
      {" "}
      <button
        onClick={toggleDrawer}
        className="fixed bottom-4 right-0 z-50 rounded-l-3xl border-0 bg-slate-500"
      >
        <IoChatbubbleSharp size={40} className="text-lightskyblue p-1" />
      </button>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        size={450}
        style={{ marginTop: "7.5%", borderRadius: "20px 0 0 0"}}
        zIndex={50}
      >
        <div className="flex flex-col justify-between md:h-5/6 h-4/5">
          <div className="flex flex-col">
            <div className="flex justify-end pt-2">
              <LiaTimesSolid size={20} onClick={toggleDrawer} />
            </div>

            <div className="flex items-center gap-2 ml-5">
              <IoChatbubbleSharp size={40} className="text-lightskyblue p-1" />
              <h1 className="text-2xl font-bold text-dimgray-100">
                Powerflow Assistant
              </h1>
            </div>

            <div className="flex items-center ml-4">
              <button className="bg-whitesmoke w-28 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0"
                onClick = {() => {
                  setMessages([
                    {
                      model: OpenAIModel.GPT_4.model,
                      role: "assistant",
                      content: `Hi there! I'm Powerflow Assistant, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?`
                    }
                  ]);
                  setModel(OpenAIModel.GPT_4.model);
                }}
              >
                New Chat
              </button>
              <button className="bg-whitesmoke w-28 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0">
                History
              </button>
              <button className="bg-whitesmoke w-28 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0">
                Prompts
              </button>
              <select className="bg-whitesmoke w-28 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                }}
                >
                <option value={OpenAIModel.GPT_3.model}>GPT-3.5</option>
                <option value={OpenAIModel.GPT_4.model}>GPT-4</option>
              </select>
            </div>

            {/*<div className="w-full absolute top-32 left-7">
              <textarea className="resize-none rounded-md h-36 w-4/5" 
                value = {content}
                onChange = {(e) => setContent(e.target.value)}
              />
              <GoPaperAirplane
                size={25}
                className="relative bottom-3 right-10 cursor-pointer"
              />
            </div>*/}
             <ChatHandler isBottomDrawer={false}/>
              </div>

          <div className="ml-8 text-left">
            <RiLayoutRightLine
              size={30}
              className="text-lightskyblue font-light"
            />
            <RiLayoutBottomLine
              size={30}
              className=" text-gray-600 font-light"
              onClick={swapDrawer}
            />
            <BsThreeDots size={30} className="text-gray-600 font-light" />
          </div>
        </div>

        {/* <div className="flex flex-col gap-10 items-center">
          <div>

            <div>
              <textarea
                name="textarea"
                rows="5"
                cols="40"
                className=" resize-none mt-4 rounded-lg border-[1px] border-gray-400 border-solid"
              ></textarea>
            </div>
          </div>
          <div className="flex gap-[13rem] items-center">
            <div className="flex">
              
            </div>
            <button className="bg-whitesmoke w-36 text-dimgray-100 rounded-lg py-3 px-7 font-light text-sm border border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white no-underline ">
              Submit
            </button>
          </div>
        </div> */}
      </Drawer>
    </>
  )
}