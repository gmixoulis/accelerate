import { useState, useRef, useEffect } from 'react';
import Success from './Success';
import autosize from 'autosize';
import { UseTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import { Danger } from '../Alerts';
import { processPrompts } from '../../utils';
import BatchModal from './Modal';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import { useBatch } from '../../context/BatchContext';
import { OpenAIModel } from '../../utils/constants';

export const Textbox = ({
  processingMode,
  title,
  setTitle,
  reset,
  setReset,
  input,
  setInput,
  model, 
  listData
}) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [promptsList, setPromptsList] = useState([]);
  const { setParallelModel, setSequentialModel } = useBatch();
  // const [listening, setListening] = useState(false);
  // const [interimTranscript, setInterimTranscript] = useState("");
  // const [transcript, setTranscript] = useState("");

  const textareaRef = useRef(null);
  const errorRef = useRef(null);


  useEffect(() => {
    if (textareaRef?.current) {
      autosize(textareaRef.current);
    }
  }, []);

  useEffect(() => {
    if (reset) {
      setInput("");
      setTitle("");
      setReset(false);

      if (processingMode === "sequential") {
        setSequentialModel(OpenAIModel.GPT_4.model);
      } else {
        setParallelModel(OpenAIModel.GPT_4.model);
      }
    }
  }, [reset, setReset, setTitle, setInput]);

  //update autosize when input changes
  useEffect(() => {
    if (textareaRef?.current) {
      autosize.update(textareaRef.current);
    }
  }, [input]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [error]);

  const submitPrompts = async () => {
    const prompts = processPrompts(input);
          if (prompts.length === 0) {
            throw { error: "no prompts entered" }
          }

          const prompt = {
            user_prompts: prompts,
            processing_mode: processingMode,
            title: title.trim() === "" ? prompts[0].substring(0, 201) : title.trim().substring(0, 201),
            model: model
          };

          const response = await fetch("/api/powerflow/prompt/new", {
            method: "POST",
            body: JSON.stringify({
              prompt: prompt,
            }),
          });

         return response;

        }

        const submitVariablePrompt = async () => {
          if (input.trim() === "") {
            throw { error: "no prompts entered" }
          }
          
          const variables = Object.keys(listData[0]);
          //all variables must be present in input as {{variable}} individually
          const missingVariables = variables.filter(variable => !input.includes(`{{${variable}}}`));

          if (missingVariables.length > 0) {
            throw { error: "missing variables", missingVariables: missingVariables }
          }

          const prompt = {
            variable_prompt: input,
            processing_mode: processingMode,
            title: title.trim() === "" ? input.substring(0, 201) : title.trim().substring(0, 201),
            model: model,
            list_data: listData
          };

          const response = await fetch("/api/powerflow/variable-prompt", {
            method: "POST",
            body: JSON.stringify({
              prompt: prompt,
            }),
          });

          return response;
        }


  return (
    <div className="flex-1 p-4 pl-0">
      <form id='batch-form' onSubmit={async (e) => {
        e.preventDefault();

        setIsSending(true);

        try {
          let response;
          if (listData.length === 0) {
            response = await submitPrompts();
          } else {
            response = await submitVariablePrompt();
          }

          const body = await response.json();

          if (body.status_code === 201 || body.status_code === 200) {
            setIsSending(false);
            setSuccess(true);
            setTitle("");
            setInput("");
          } else {
            console.log("error:", body)
            throw { error: body }
          }

        } catch (error) {
          console.log(error);
          setIsSending(false);
          let errMessage = t("sendFailed"); 
          if (error?.error && error.error === "missing variables") {
            errMessage = [
              `${t("missing variables")}`,
              <ul className='list-disc ml-6'>
                {error.missingVariables.map(variable => <li key={variable}>{variable}</li>)}
              </ul>
            ];
          } else if (error?.error && error.error === "no prompts entered") {
            errMessage += '. ' + t("no prompts entered");
          }
          setError(errMessage);
        }
      }}>

        <div className="relative">
          <textarea
            name='batch-input'
            ref={textareaRef}
            rows={8}
            className="flex-1 w-full custom-box my-4 p-4 pb-10 pr-10"
            style={{ resize: "none", overflow: "hidden" }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder={processingMode === "sequential" ? t("placeholders.sequential") : t("placeholders.parallel")}
            required
          />

          <div className='absolute bottom-5 right-3'>
            <IconButton aria-label="send" onClick={() => {
              const prompts = processPrompts(input);
              setPromptsList(prompts);
              setOpen(true)
            }}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
        {
          isSending &&
          <div className="text-gray-600 dark:text-gray-200 text-7xl mt-2 flex justify-center items-end gap-2">
            {t("sending prompts")}
            <div className="flex space-x-1">
              <div className="h-1.5 w-1.5 bg-gray-600 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.0s' }}></div>
              <div className="h-1.5 w-1.5 bg-gray-600 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-1.5 w-1.5 bg-gray-600 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        }
        {
          error &&
          <div ref={errorRef} className="mt-2 flex justify-center lg:max-w-[60%] mx-auto">
            <Danger title={`${t("error")}:`} message={error} onClose={() => {
              setError(null);
            }} />
          </div>
        }
        <Success success={success} setSuccess={setSuccess} />
      </form>
      <BatchModal open={open} setOpen={setOpen} prompts={promptsList} model={model} />
    </div>
  );
};

export default Textbox;