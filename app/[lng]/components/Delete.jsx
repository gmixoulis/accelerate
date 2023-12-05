import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useParams } from 'next/navigation'
import { UseTranslation } from '@/app/i18n/client'
import { IconLoader2 } from '@tabler/icons-react'


const Delete = ({ 
  open, 
  onClose, 
  onDelete, 
  item, 
  errorMessage,
  deleting
}) => {
  const params = useParams();
  const lng = params.lng;
  const { t } = UseTranslation(lng, "powerflow");

  const cancelButtonRef = useRef(null);


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative !z-[999999]" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                <div className="px-4 pt-5 pb-4 bg-white dark:bg-gray-900 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full bg-red-50 dark:bg-red-300 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-100 dark:text-white " aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {`${t("delete")}`}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-200">
                          {t("deleteConfirmation")}
                        </p>
                        {errorMessage && (
                          <p className="mt-2 text-sm text-red-100 dark:bg-gray-700 dark:bg-opacity-75 dark:p-2">
                            {errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-900 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={onDelete}
                  >
                    { deleting ? <IconLoader2 className="w-5 h-5 text-white animate-spin" /> : t("delete")}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-800 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:hover:bg-gray-200 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Delete
