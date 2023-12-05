import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

const ResetChat = ({ onReset }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  return (
      <button
        className="text-sm sm:text-base font-semibold rounded-md px-3 py-2 primary-button"
        onClick={() => onReset()}
      >
        {t("reset")}
      </button>
  );
};

export default ResetChat;