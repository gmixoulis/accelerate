import { IconDots } from "@tabler/icons-react";

export const ChatLoader = () => {
  return (
    <div className="flex flex-col flex-start">
      <div
        className={`flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl px-4 py-2 w-fit`}
        style={{ overflowWrap: "anywhere" }}
      >
        <IconDots className="animate-pulse" />
      </div>
    </div>
  );
};
