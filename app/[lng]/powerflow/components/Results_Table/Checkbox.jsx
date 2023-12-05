import { Checkbox as MuiCheckbox } from '@mui/material';

const Checkbox = ({ id, checked, onChange, htmlFor }) => {
  return (
    <div className="flex items-center justify-center h-5">
        <MuiCheckbox
          id={id}
          size='small'
          checked={checked}
          onChange={onChange}
          disableRipple
          className='mui-checkbox'
        />
        <label htmlFor={htmlFor} className="sr-only">Checkbox</label>
      </div>
  )
}

export default Checkbox