import { OpenAIModel } from "../utils/constants";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Popover } from "@mui/material";
import { useState } from "react";

function getDisplayName(model) {
    switch (model) {
        case OpenAIModel.GPT_4.model:
            return "GPT-4";
        case OpenAIModel.GPT_3.model:
            return "GPT-3.5";
        case OpenAIModel.GPT_3_INSTRUCT.model:
            return "GPT-3.5 Instruct";
        case OpenAIModel.GPT_4_TURBO.model:
            return "GPT-4 Turbo";
        case OpenAIModel.GPT_4_TURBO_VISION.model:
            return "GPT-4 Turbo Vision";
        case OpenAIModel.GPT_3_TURBO.model:
            return "GPT-3.5 Turbo";
        default:
            return "";
    }
}

export default function ModelSelect({ value, onChange, activeTab, disabled }) {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (activeTab === "stream" && disabled) {
            setPopoverOpen(true);
        }
    };
    
      const handleClose = () => {
          setAnchorEl(null);
          setPopoverOpen(false);
      };
    
      const id = popoverOpen ? 'model-popover' : undefined;

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">{t("model")}</InputLabel>
                <div aria-describedby={id} onClick={handleClick}>
                <Select
                    labelId="model-select-label"
                    id="model-select"
                    value={value}
                    onChange={onChange}
                    label={t("model")}
                    inputProps={{ readOnly: (activeTab === "stream" && disabled) || false }}
                    fullWidth
                >
                    {process.env.NEXT_PUBLIC_APP_ENV !== "PROD" ? (
                        activeTab === "stream" ? (
                            Object.values(OpenAIModel).map((model) => (
                                <MenuItem key={model.model} value={model.model}>
                                    {getDisplayName(model.model)}
                                </MenuItem>
                            ))
                        ) : (
                            Object.values(OpenAIModel)
                            .filter((model) => model.model !== OpenAIModel.GPT_4_TURBO_VISION.model)
                            .map((model) => (
                                <MenuItem key={model.model} value={model.model}>
                                    {getDisplayName(model.model)}
                                </MenuItem>
                            ))
                        )
                    ) : (
                        Object.values(OpenAIModel)
                            .filter((model) => model.model !== OpenAIModel.GPT_4_TURBO_VISION.model && model.model !== OpenAIModel.GPT_4_TURBO.model)
                            .map((model) => (
                                <MenuItem key={model.model} value={model.model}>
                                    {getDisplayName(model.model)}
                                </MenuItem>
                            ))
                    )}
                </Select>
                </div>
            </FormControl>
            <Popover
                id={id}
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                slotProps={{ paper: { className: "bg-white dark:bg-darkslategray-100 p-2 flex items-center w-60 dark:text-white" } }}
            >
                {t("modelSelectPopover")}
            </Popover>
        </Box>
    );
}
