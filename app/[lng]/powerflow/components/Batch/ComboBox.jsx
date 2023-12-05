import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from 'next/navigation';

export default function ComboBox({options = [], loading, label, setValue}) {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");

  const [open, setOpen] = React.useState(false);


  return (
    <Autocomplete
      id="asynchronous-select"
      className='autocomplete'
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      getOptionLabel={(option) => option.label}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      loadingText={t("loading")}
      noOptionsText={t("no options")}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size='small'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

