import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react';
import ComboBox from './ComboBox';
import { Button, Chip, TextField } from '@mui/material';
import { handleCopyClick } from '../../utils';
import Add from '../User Lists/AddList';
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import ContentCopy from '@mui/icons-material/ContentCopy';

export default function ListAndVariables({ useList, listData, setListData }) {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");

  const [expanded, setExpanded] = useState(false);
  const [selectedList, setSelectedList] = useState({});
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingListData, setLoadingListData] = useState(false);
  const [addListOpen, setAddListOpen] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  const fetchLists = () => {
    setLoadingLists(true);
    //Get lists
    fetch("/api/powerflow/user-list", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status_code !== 200) {
          throw data;
        }
        setLists(data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingLists(false);
      });
  }


  useEffect(() => {
    fetchLists();
  }, [useList, addListOpen]);

  useEffect(() => {
    if (selectedList && selectedList.id) {
      setLoadingListData(true);
      fetch(`/api/powerflow/user-list/${selectedList.id}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          const dataArr = JSON.parse(data.data[0].list_data);
          setListData(dataArr);
          setLoadingListData(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoadingListData(false);
        });
    } else {
      setListData([]);
    }
  }, [selectedList]);


  return (
    <div className='flex flex-col'>
      <Accordion expanded={expanded === `panel-1`} onChange={handleChange(`panel-1`)} square={false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className='dark:text-white' />}
          aria-controls={`panel-1bh-content`}
          id={`panel-1bh-header`}
        >
          {t("lists")} {t("and")} {t("variables")}
        </AccordionSummary>
        <AccordionDetails>
          <div className='flex flex-wrap gap-4 items-center pt-2'>
            <ComboBox 
            options={lists.map(list => ({ label: list.list_name, id: list.list_id }))} 
            label={t("lists")} 
            loading={loadingLists} 
            setValue={setSelectedList} 
            />
            <Button onClick={() => setAddListOpen(true)} variant='outlined' startIcon={<AddIcon />}>{t("create new list")}</Button>
          </div>

          <div className='py-2 flex flex-wrap gap-4 my-6'>
            {
              loadingListData && (
                <>
                  <Chip className='dark:bg-gray-600 animate-pulse w-20 h-8' />
                  <Chip className='dark:bg-gray-600 animate-pulse w-20 h-8' />
                  <Chip className='dark:bg-gray-600 animate-pulse w-20 h-8' />
                </>
              )
            }
            {
              listData.length > 0 && (
                Object.keys(listData[0]).map((key, index) => (
                  <Chip 
                    key={index} 
                    label={`{{${key}}}`} 
                    className='dark:bg-gray-600 text-md' 
                    deleteIcon={<ContentCopy style={{ fontSize: 18 }}/>}
                    onDelete={(event) => {
                      event.stopPropagation();
                      handleCopyClick({content: `{{${key}}}`});
                    }}
                    sx={{ userSelect: 'unset' }}
                  />
                ))
              )
            }
          </div>
          <span className='text-gray-500 dark:!text-gray-300'>{t("variable instruction")}</span>
        </AccordionDetails>
      </Accordion>
      <Add open={addListOpen} setOpen={setAddListOpen} />
    </div>
  );
}