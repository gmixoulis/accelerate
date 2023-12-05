import { FormControlLabel, Switch as MuiSwitch } from "@mui/material";

export default function Switch({ checked, onChange, label }) {
    return  <FormControlLabel control={<MuiSwitch checked={checked} onChange={onChange} disableRipple className='autorefresh'/>} label={label} />
}