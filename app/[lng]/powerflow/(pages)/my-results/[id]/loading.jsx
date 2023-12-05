export default function PageLoading() {
    return (
        <div className="animate-pulse">
            {Array.from({ length: 6 }, (_, i) => (
                <div
                    className="text-white flex flex-col justify-center my-4"
                    key={i}
                >
                    <div className="w-full md:max-w-[85%]">
                        <div className="message-bubble custom-box assistant-message bg-gray-200 text-gray-800">
                            <div className="message-header invisible">
                                ChatGPT
                                <div>
                                    <button className="btn btn-xs btn-neutral p-1 ml-2">
                                        <div className="bg-gray-700/50 h-4 w-4 rounded-full"></div>
                                    </button>
                                    <button className="btn btn-xs btn-neutral p-1 ml-2">
                                        <div className="bg-gray-700/50 h-4 w-4 rounded-full"></div>
                                    </button>
                                </div>
                            </div>
                            <div className="message-content">
                                <div className="bg-gray-700/50 my-6 px-6 rounded-lg">
                                    <h2 className="text-lg invisible">This is a skeleton render</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}