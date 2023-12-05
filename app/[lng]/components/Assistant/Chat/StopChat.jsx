export const StopChat = ({ onStop }) => {
  return (
      <button
        className="bg-whitesmoke w-20 py-2 mx-3 text-dimgray-100 rounded-lg font-bold border-[1px] border-gray-400 border-solid cursor-pointer hover:bg-lightskyblue hover:text-white hover:border-0"
        onClick={() => onStop()}
      >
        Stop
      </button>
  );
};
;