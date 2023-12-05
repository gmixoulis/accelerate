import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Skeleton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemButton,
    Collapse
} from '@mui/material';
import { UseTranslation } from '@/app/i18n/client';
import { useParams } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { fetchTokens } from '../../utils';
import { getMaxTokens } from '../../utils/constants';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EastIcon from '@mui/icons-material/East';
import WarningIcon from '@mui/icons-material/Warning';

export default function BatchModal({ open, setOpen, prompts, model }) {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");
    const handleClose = () => setOpen(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openPrompt, setOpenPrompt] = useState({});
    const [exceeds, setExceeds] = useState([]);


    const handleClick = (index) => {
        setOpenPrompt(prevState => ({ ...prevState, [index]: !prevState[index] }));
    };

    useEffect(() => {
        const getTokensForEachPrompt = async () => {
            setLoading(true);
            const tokensList = await Promise.all(prompts.map(async prompt => {
                const tokens = await fetchTokens(model, prompt);
                return tokens;
            }));
            const rows = prompts.map((prompt, i) => {
                return {
                    prompt: prompt,
                    tokens: tokensList[i],
                    exceeds: tokensList[i] > getMaxTokens(model)
                }
            });
            setRows(rows);
            setLoading(false);
        }

        if (open && prompts.length > 0) {
            getTokensForEachPrompt();
        } else {
            setRows([]);
            setExceeds([]);
        }
    }, [open, prompts, model]);

    const totalTokens = rows.reduce((total, row) => total + row.tokens, 0);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="prompt-preview"
            aria-describedby="prompt-preview"
            PaperProps={{ className: "!bg-white dark:!bg-darkslategray-100" }}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id="prompt-preview" className='border-b dark:border-gray-600'>
                <div className="flex items-center justify-between p-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {t("prompt preview")}
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize='small' />
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
            </DialogTitle>
            <DialogContent className='mt-4'>
                    {loading ? (
                        <div className='flex flex-col gap-4'>
                            <div>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='dark:bg-gray-700 max-w-[80%]'/>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='dark:bg-gray-700 w-36'/>
                        </div>
                        <div>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='dark:bg-gray-700 max-w-[80%]'/>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} className='dark:bg-gray-700 w-36'/>
                        </div>
                        </div>
                    ) : (
                        rows.map(({ prompt, tokens }, i) => {
                            return (
                                 <List
                                 component="nav"
                                 aria-labelledby="nested-list-subheader"
                                 className={`${exceeds.includes(i) ? "border-2 border-red-100 dark:border-red-100" : "bg-white dark:bg-darkslategray-100"} border-b-2 dark:border-gray-600`}
                               >
                                 <ListItemButton onClick={() => handleClick(i)}>
                                   <ListItemIcon>
                                     <EastIcon className={`${exceeds.includes(i) ? "text-red-100 dark:!text-red-100" : "text-gray-800 dark:text-white"}`}/>
                                   </ListItemIcon>
                                   <ListItemText primary={
                                    <span className='flex flex-wrap justify-between'>{`${t("prompt")} ${i + 1}`}
                                    {exceeds.includes(i) && <span className='mr-2'><WarningIcon fontSize='small' className='text-red-300 dark:!text-red-300'/> {t("exceeds max tokens")}</span>}
                                    </span>
                                } secondary={
                                   <span className='dark:text-gray-300'>
                                    {`${t("approximate tokens")}: ${tokens}`}
                                    </span>}/>
                                   {openPrompt[i] ? <ExpandLess /> : <ExpandMore />}
                                 </ListItemButton>
                                 <Collapse in={openPrompt[i]} timeout="auto" unmountOnExit>
                                   <List component="div" disablePadding>
                                     <ListItem sx={{ pl: 4 }} className='bg-gray-100 dark:bg-[#313131]'>
                                       <ListItemText primary={prompt} />
                                     </ListItem>
                                   </List>
                                 </Collapse>
                               </List>
                            )
                        })
                    )}
            </DialogContent>
            <DialogActions sx={{ padding: "16px" }} className='flex flex-wrap gap-1 gap-y-4'>
                {
                    totalTokens > 0 &&
                        <p className='justify-self-start mr-auto ml-4 text-gray-800 dark:text-white'>
                            {t("total tokens")}: {totalTokens}
                        </p>
                }
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white py-2.5 px-5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                >
                    {t("cancel")}
                </button>
                <button
                    form="batch-form"
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-dimgray-200 py-2.5 px-5 text-sm font-semibold text-white shadow-sm hover:bg-dimgray-100 sm:ml-3 sm:w-auto disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-gray-500"
                    onClick={(e) => {
                        const exceedingPrompts = rows.map((row, index) => {
                            if (row.exceeds) {
                                return index;
                            }
                        }).filter(index => index !== undefined);
                        setExceeds(exceedingPrompts);
                        if (exceedingPrompts.length > 0) {
                            e.preventDefault();
                        } else {
                            handleClose();
                        }
                    }}
                >
                    {t("submit")}
                </button>
            </DialogActions>
        </Dialog>
    );
}
