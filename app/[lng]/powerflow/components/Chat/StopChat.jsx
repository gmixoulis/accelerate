import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

export const StopChat = ({ onStop }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");

  return (
      <button
        className="rounded-lg text-sm sm:text-base font-semibold rounded-lg px-4 py-2.5 mb-1 secondary-button self-end md:self-auto"
        onClick={() => onStop()}
      >
        {t("stop")}
      </button>
  );
};
;