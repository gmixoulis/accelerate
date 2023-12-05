import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { AiFillCaretDown } from 'react-icons/ai'
import { UseTranslation } from '@/app/i18n/client';
import {useParams} from "next/navigation";


export default function MultipleSelect({ options, selected, setSelected, displayValue }) {
  const [query, setQuery] = useState('')
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");

  const filtered =
    query === ''
      ? options
      : options.filter((option) =>
          option[displayValue]
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className="flex flex-1">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative">
          <div className="relative w-full custom-box cursor-default overflow-hidden">
            <Combobox.Input
              className="w-full border-none p-2 pr-10 text-gray-900 focus:ring-0 custom-box"
              displayValue={(selected) => selected[displayValue]}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("placeholders.selectList")}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <AiFillCaretDown
                className="text-gray-600 dark:text-gray-300"
                aria-hidden="true"
                size={18}
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md custom-box py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
              {Array.isArray(filtered) && filtered.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filtered.map((option) => (
                  <Combobox.Option
                    key={option.list_id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option[displayValue]}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}