"use client"

import { BsThreeDots } from "react-icons/bs"
import { GoPaperAirplane } from "react-icons/go"
import { IoChatbubbleSharp } from "react-icons/io5"
import { LiaTimesSolid } from "react-icons/lia"
import { RiLayoutBottomLine, RiLayoutRightLine } from "react-icons/ri"
import Drawer from "react-modern-drawer"

import "react-modern-drawer/dist/index.css"
import ChatHandler from "./components/Assistant/ChatHandler"
import { useAssistant } from "@/context/AssistantContext"
import { OpenAIModel } from "@/app/[lng]/powerflow/utils/constants"

export default function AssistantBottom({ swapDrawer, toggleDrawer, isOpen }) {
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
      <div></div>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="bottom"
        size={500}
        style={{ borderRadius: "20px 0 0 0" }}
        zIndex={50}
      >
        <div className="flex justify-between mx-6 mt-4 items-center">
          <div className="md:flex md:items-center md:gap-20 md:mb-1 mb-5">
            <div className="flex md:items-center justify-center">
              <IoChatbubbleSharp size={40} className="text-lightskyblue p-1" />
              <h1 className="text-2xl font-bold text-dimgray-100">
                Powerflow Assistant
              </h1>
            </div>
            <div className="flex items-center">
              <button className="bg-whitesmoke w-28 h-8 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0"
                onClick = {() => {
                  setMessages([
                    {
                      model: OpenAIModel.GPT_4.model,
                      role: "assistant",
                      content: "Hello, I am the Powerflow Assistant. I am here to help you with your powerflow. How can I help you today?",
                    },
                  ]);
                  setModel(OpenAIModel.GPT_4.model);
                }}
              >
                New Chat
              </button>
              <button className="bg-whitesmoke w-28 h-8 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0">
                History
              </button>
              <button className="bg-whitesmoke w-28 py-2 h-8 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0">
                Prompts
              </button>
              <select className="bg-whitesmoke w-28 py-1 h-8 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                }}
                >
                <option value={OpenAIModel.GPT_3.model}>GPT-3.5</option>
                <option value={OpenAIModel.GPT_4.model}>GPT-4</option>
              </select>
            </div>
          </div>
          <div>
            {" "}
            <LiaTimesSolid size={20} onClick={toggleDrawer} />
          </div>
        </div>

        <ChatHandler isBottomDrawer={true}/>
        <div className="flex items-center mt-8 ml-2 text-left">
          <RiLayoutRightLine
            size={55}
            className="text-gray-600 font-light pl-6"
            onClick={swapDrawer}
          />
          <RiLayoutBottomLine
            size={55}
            className="text-lightskyblue font-light px-3"
          />
          <BsThreeDots size={30} className="text-gray-600 font-light" />
        </div>

        {/* <div className="flex">
          <div className="w-11/12 flex justify-center">
            <div className="flex flex-col items-center w-full">
              

              <div className="flex items-center mb-5">
                <button className="bg-whitesmoke w-28 h-8 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0">
                  New Chat
                </button>
                <button className="bg-whitesmoke w-28 h-8 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0">
                  History
                </button>
                <button className="bg-whitesmoke w-28 py-2 h-8 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0">
                  Prompts
                </button>
                <div className="flex justify-center"></div>
              </div>
              <div className="flex justify-center w-1/2">
                <textarea className="resize-none rounded-md w-full" />
              </div>
            </div>
          </div>
          
        </div> */}
        {/* <RiLayoutRightLine
          size={30}
          className="text-gray-600 font-light pl-6"
          onClick={swapDrawer}
        />
        <RiLayoutBottomLine
          size={30}
          className="text-lightskyblue font-light px-3"
        />
        <BsThreeDots size={20} className=" text-gray-600 font-light" /> */}
      </Drawer>
    </>
  )
}
