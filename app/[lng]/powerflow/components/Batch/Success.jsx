import { UseTranslation } from '@/app/i18n/client';
import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation';
import { Success as SuccessAlert} from '../Alerts';

const Success = ({ success, setSuccess }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const successRef = useRef(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 3000)

      if (successRef.current) {
        successRef.current.focus();
      }

      return () => clearTimeout(timer)
    }
  }, [success, setSuccess])


  return (
    <div ref={successRef} className={`mt-2 flex mx-auto lg:max-w-[60%] transition-opacity duration-1000 ${success ? 'opacity-100' : 'opacity-0'}`}>
      <SuccessAlert title={t("sendSuccess")} />
    </div>
  )
}

export default Success
