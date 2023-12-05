import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography 
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useParams } from 'next/navigation'
import { UseTranslation } from '@/app/i18n/client'
import { LoadingButton } from '@mui/lab';

const Delete = ({ 
  open, 
  onClose, 
  onDelete, 
  item = "", 
  errorMessage,
  deleting
}) => {
  const params = useParams();
  const lng = params.lng;
  const { t } = UseTranslation(lng, "powerflow");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{className: "!bg-white dark:!bg-darkslategray-100"}}
    >
      <DialogTitle id="alert-dialog-title">
        <Box display="flex" alignItems="center">
          <WarningIcon className='text-red-300 dark:!text-red-300' />
          <Box ml={1} className='text-gray-800 dark:text-white font-medium'>
            {`${t("delete")}`}
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" className='!font-medium text-gray-800 dark:text-gray-200'>
          {t("deleteConfirmation")}
        </Typography>
        {errorMessage && (
          <Typography variant="body2" className='text-sm text-red-100 dark:bg-gray-700 dark:bg-opacity-75 dark:p-2 dark:text-red-400'>
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{padding: "16px"}}>
        <Button 
          onClick={onClose} 
          variant='outlined' 
          className='!font-medium !text-md !border-gray-600 dark:!border-gray-300 !text-gray-600'
          sx={{textTransform: "capitalize"}}
        >
          {t("cancel")}
        </Button>
        <LoadingButton
          loading={deleting}
          onClick={onDelete}
          variant="contained"
          color="error"
          className='!font-medium !text-md text-white'
          sx={{textTransform: "capitalize"}}
        >
          <span>{t("delete")}</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default Delete;
