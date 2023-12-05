import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Danger, Info, Warning } from './Alerts';
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

export function AlertOverlay({ isOpen, setIsOpen, type, message }) {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  let alert;

  switch (type) {
    // case "info":
    //     alert = <Info title="Info" message={message} />
    //     break;
    // case "success":
    //     alert = <Success title="Success" message={message} />
    //     break;
    case "danger":
      alert = <Danger title={`${t("error")}:`} message={message} onClose={() => setIsOpen(false)} />
      break;
    case "warning":
      alert = <Warning title={`${t("warning")}:`} message={message} onClose={() => setIsOpen(false)} />
      break;
    case "info":
      alert = <Info title={`${t("info")}:`} message={message} onClose={() => setIsOpen(false)} />
      break;
    default:
      alert = null;
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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

        <div className="fixed top-14 inset-x-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg transition-all my-8 w-full max-w-xl md:max-w-3xl text-left">
                {alert}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
