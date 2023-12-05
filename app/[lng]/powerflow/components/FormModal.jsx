"use client"
import { Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import Form from './Form'
import { useState } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { useRouter, useParams } from 'next/navigation'
import { UseTranslation } from '@/app/i18n/client'




const FormModal = ({ open, setOpen, initialValues = null, reset, onSubmit, title, children, disabled }) => {
  const params = useParams();
  const lng = params.lng;
  const { t } = UseTranslation(lng, "powerflow");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset && reset();
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ className: "!bg-white dark:!bg-darkslategray-100 text-gray-800 dark:text-gray-200" }}
      fullWidth
      maxWidth="sm"
    >
      <Form onSubmit={async (values) => {
        setSubmitting(true);
        const success = await onSubmit(values);
        setSubmitting(false);
        if (success) {
          setTimeout(() => {
            setOpen(false);
          }, 3000);
        }
        router.refresh();
      }} defaultValues={initialValues}>
        <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-800 dark:text-white flex flex-wrap gap-4 mt-2 mb-4">
          {title}
        </DialogTitle>
        <DialogContent className='flex flex-col gap-6'>
          {children}
        </DialogContent>
        <DialogActions className="flex gap-1 !p-6 items-center">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-white py-2.5 px-5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => {
              reset && reset();
              setOpen(false)
            }}
          >
            {t("cancel")}
          </button>
          <button
            disabled={disabled}
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-dimgray-200 py-2.5 px-5 text-sm font-semibold text-white shadow-sm hover:bg-dimgray-100 sm:ml-3 sm:w-auto disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-gray-500"
          >
            {submitting ? <IconLoader2 className="animate-spin h-5 w-5 text-white" /> : t("submit")}
          </button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}

export default FormModal
