// BasicSelect.js
import * as React from "react"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

export default function BasicSelect({ key, label, data, onChange, itemName }) {
  const [value, setValue] = React.useState("")

  const handleChange = (event) => {
    setValue(event.target.value)
    onChange(event)
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={`select-${label}-label`}>{label + " *"}</InputLabel>
        <Select
          className="dark:text-white dark:bg-darkslategray-100"
          labelId={`select-${label}-label`}
          id={`select-${label}`}
          value={value}
          name={name}
          label={label + " *"}
          onChange={handleChange}
        >
          {data.map((item, index) => (
            <MenuItem key={index} value={item[label + "ID"]}>
              {item.Description ||
                item[Object.keys(item).filter((key) => key.includes("Name"))]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
