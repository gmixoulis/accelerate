import { createContext, useContext, useState, useMemo } from "react";
import { OpenAIModel } from "../utils/constants";

const BatchContext = createContext({});

export const useBatch = () => {
    return useContext(BatchContext);
};

export const BatchProvider = ({ children }) => {

    //Parallel
    const [parallelContent, setParallelContent] = useState("");
    const [parallelModel, setParallelModel] = useState(OpenAIModel.GPT_4.model);
    const [parallelTitle, setParallelTitle] = useState("");

    //Sequential
    const [sequentialContent, setSequentialContent] = useState("");
    const [sequentialModel, setSequentialModel] = useState(OpenAIModel.GPT_4.model);
    const [sequentialTitle, setSequentialTitle] = useState("");

    const value = useMemo(() => ({
        parallelContent,
        setParallelContent,
        parallelModel,
        setParallelModel,
        sequentialContent,
        setSequentialContent,
        sequentialModel,
        setSequentialModel,
        parallelTitle,
        setParallelTitle,
        sequentialTitle,
        setSequentialTitle,
    }), [parallelContent, parallelModel, sequentialContent, sequentialModel, parallelTitle, sequentialTitle]);

    return (
        <BatchContext.Provider value={value}>
            {children}
        </BatchContext.Provider>
    )
}
