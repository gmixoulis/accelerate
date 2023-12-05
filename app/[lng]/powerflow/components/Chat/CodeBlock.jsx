import { useState, useEffect, memo} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { IconCheck, IconClipboard, IconDownload } from '@tabler/icons-react';
import { handleCopyClick } from '../../utils';
import { programmingLanguages } from '../../utils/constants';
import Alert from '../Alert';
import { useParams } from 'next/navigation';
import { UseTranslation } from '@/app/i18n/client';


const CodeBlock = ({ language, value }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const [codeCopied, setCodeCopied] = useState(false);
  const [alert, setAlert] = useState({title: '', message: '', show: false});
  const [fileName, setFileName] = useState('');

  const fileExtension = programmingLanguages[language] || '.txt';

  const downloadAsFile = () => {
    if (!fileName) {
      // user pressed cancel on prompt
      return;
    }

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${fileName}${fileExtension}`;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (codeCopied) {
      setTimeout(() => {
        setCodeCopied(false)
      }, 1000);
    }
  }, [codeCopied]);


  return (
    <div className="code-header rounded-md">
    <div className="flex items-center justify-between pb-2 px-3 pt-3">
     <span className="text-sm lowercase text-white">{language}</span>
     <div className="flex items-center gap-3">
       <button
         className="flex gap-1.5 items-center rounded bg-none text-sm text-white"
         onClick={() => {
           handleCopyClick({content: value});
           setCodeCopied(true);
         }}
       >
         {codeCopied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
         {codeCopied ? t("copied") : t("copy code")}
       </button>
       <button
         className="flex items-center rounded bg-none text-white"
         onClick={() => { 
          setAlert({
          title: t("downloadFile"),
          message: t("enterFile"),
          show: true
        })

        const date = new Date();
        const suggestedFileName = `file-${
            date.toISOString().split("T")[0]}_${date.getTime()
        }`;
    
        setFileName(suggestedFileName);
      
      }}
       >
         <IconDownload size={18} />
       </button>
     </div>
   </div>
     <SyntaxHighlighter
       language={language}
       PreTag="div"
       style={atomDark}
       wrapLongLines={true}
     >
       {value}
     </SyntaxHighlighter>
      <Alert alert={alert} setAlert={setAlert}>
        <div className="flex gap-2 mt-2">
        <div className='flex flex-1'>
        <input
          type="text"
          className="w-full custom-box p-2"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <div className="custom-box p-2 assistant-message">
          {fileExtension}
        </div>
        </div>
          <button
            className="p-2 rounded-md primary-button text-white"
            onClick={() => {
              downloadAsFile();
            }
          }>
            {t("ok")}
          </button>
        </div>
      </Alert>
     </div>
  );
};

export default memo(CodeBlock);