import { useEffect, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ClearIcon from "@mui/icons-material/Clear"
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete"
import Popper from "@mui/material/Popper"
import TextField from "@mui/material/TextField"
import { styled, useTheme } from "@mui/material/styles"

const Dropdown = ({ options, selected, setSelected }) => {
  const [query, setQuery] = useState(
    selected ? selected.name || selected.SiteName : ""
  )

  useEffect(() => {
    setQuery(selected ? selected.name || selected.SiteName : "")
  }, [selected])

  const filteredOptions =
    typeof query === "undefined" || query?.length === 0
      ? options
      : options.filter((option) =>
          (option.name || option.SiteName)
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query?.toLowerCase().replace(/\s+/g, ""))
        )

  const handleChange = (_, newValue) => {
    setQuery(newValue)
    setSelected(newValue)
  }
  const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
      backgroundColor: "#58595b",
      boxSizing: "border-box",
      color: "#fff",
      "& ul": {
        padding: 0,
        margin: 0,
      },
    },
  })
  return (
    <Autocomplete
      value={selected}
      id="dropdown"
      PopperComponent={StyledPopper}
      options={filteredOptions.map((option) => option.name || option.SiteName)}
      className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-white border-black border-solid focus:border-black focus:bg-white dark:focus:bg-gray-800 dark:text-white focus:ring-0 dark:bg-gray-800"
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          id="textfiled"
          value={selected}
          label={selected ? "" : "Select an option..."}
          className="border-solid focus:border-black focus:bg-white dark:bg-blue-gray-800 dark:text-white dark:focus:bg-gray-800"
        />
      )}
    />
  )
}

export default Dropdown
