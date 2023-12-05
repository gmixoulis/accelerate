import { Fragment, useState } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { AiFillCaretDown } from "react-icons/ai"
import { BsCheck2 } from "react-icons/bs"
import { useParams } from "next/navigation"
import { UseTranslation } from "@/app/i18n/client"

const AutoCompleteDropdown = ({ options, selected, setSelected, loading }) => {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "preferences")

  const [query, setQuery] = useState("")

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative">
        <div className="relative w-full overflow-hidden focus:outline-none dark:text-gainsboro-400">
          <Combobox.Input
            className="w-full bg-gray-100 dark:bg-gray-700 border-[0.5px] rounded-md border-gray-400 border-solid py-2 px-5 pl-3 pr-10 leading-5 text-gray-900 dark:text-gainsboro-400"
            displayValue={(option) => option.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("Select an option")}
          />
          <Combobox.Button className="absolute inset-y-0 right-3 flex items-center pr-2">
            <span>
              <AiFillCaretDown size={20} />
            </span>
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-darkslategray-200 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gainsboro-400 text-left">
                {t("No results found")}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-5 pr-4 ${
                      active
                        ? "bg-whitesmoke dark:bg-darkslategray-100 text-unicred-300"
                        : "text-gray-900 dark:bg-darkslategray-200 dark:text-whitesmoke"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex w-full justify-between">
                        <span
                          className={`block truncate ${
                            selected ? "" : "font-normal"
                          }`}
                        >
                          {option.name}
                        </span>
                        {selected ? (
                          <span className="flex items-center pl-3 text-unicred-300">
                            <BsCheck2 className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

export default AutoCompleteDropdown
