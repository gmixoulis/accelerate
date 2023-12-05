import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AiOutlineClose } from 'react-icons/ai'

export default function Alert({alert, setAlert, children}) {

  return (
    <Transition.Root show={alert.show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setAlert({...alert, show: false})}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed top-0 inset-x-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-md">
                <div className="bg-white dark:bg-darkslategray-200 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex">
                    <div className="mt-3 sm:ml-4 sm:mt-0 text-left flex-1">          
                      <div className='flex items-center justify-between'>
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {alert.title}
                      </Dialog.Title>
                      <button className='bg-transparent outline-none border-none'>
                      <AiOutlineClose className="h-5 w-5 text-gray-500  hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer" aria-hidden="true" onClick={() => {
                            setAlert({...alert, show: false})
                      }}/></button>
                        </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {alert.message}
                        </p>
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
