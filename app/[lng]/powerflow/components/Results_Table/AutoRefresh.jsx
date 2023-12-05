"use client"
import {useState, useEffect} from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UseTranslation } from "@/app/i18n/client";
import { FormControlLabel, Switch } from '@mui/material';



const AutoRefresh = ({setIsFetching, isFetching}) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const [autoRefresh, setAutoRefresh] = useState(
        JSON.parse(localStorage.getItem("autoRefresh") || "true") 
      );

      useEffect(() => {
        localStorage.setItem('autoRefresh', JSON.stringify(autoRefresh));
      }, [autoRefresh]);


    const router = useRouter();

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                setIsFetching(true);
                router.refresh();
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, router, setIsFetching]);

    useEffect(() => {
        if (isFetching) {
            setTimeout(() => {
                setIsFetching(false);
            }, 1000);
        }
    }, [isFetching, setIsFetching]);
  

    return (
        // <div className="flex items-center">
        // <label className="relative flex items-center cursor-pointer">
        // <input id="auto-refresh-switch" checked={autoRefresh} type="checkbox" value="" className="sr-only peer" onChange={(e) => setAutoRefresh(e.target.checked)}/>
        // <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 dark:peer-focus:ring-gray-500 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-dimgray-200 dark:peer-checked:bg-gray-900"></div>
        // <span className="ml-3 text-md font-medium text-gray-900 dark:text-gray-300">{t("auto refresh")}</span>
        // </label>
        // </div>
        <FormControlLabel control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} disableRipple className='autorefresh'/>} label={t("auto refresh")} />
    )
}

export default AutoRefresh