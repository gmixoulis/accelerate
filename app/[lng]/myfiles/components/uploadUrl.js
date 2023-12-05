import { useContext, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { OpenInBrowser } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material"

import { MyFilesContext } from "@/app/[lng]/myfiles/contexts/myFilesContext"
import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"
import { getFiles } from "@/app/[lng]/myfiles/services/MyFilesService"
import { UseTranslation } from "@/app/i18n/client"

export default function UploadUrl({ setFiles }) {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")
  const [fetchImages, setFetchImages] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [urlTextFieldValue, setUrlTextFieldValue] = useState("")
  const { setNotification } = useContext(MyFilesContext)

  const handleUploadUrl = async () => {
    setLoading(true)

    if (false === validateUrl(urlTextFieldValue)) {
      setLoading(false)
      setNotification({
        message: t("Please use a valid URL"),
        severity: "error",
      })
      return
    }

    const payload = {
      Url: urlTextFieldValue,
      FetchImages: fetchImages,
    }

    try {
      await MyFilesService.requestWebscraping(payload)

      const files = await MyFilesService.getFiles(["FileType,Metadata"], {
        WithoutWebsiteImages: true,
        OnlyParents: true,
      })

      setFetchImages(false)
      setUrlTextFieldValue("")
      setFiles(files.data)
      setError(null)
      setNotification({
        message: t("Fetching URL. Results will be ready in a few minutes."),
        severity: "success",
      })
      setLoading(false)
    } catch (error) {
      setNotification({
        message: t("Fetching URL failed."),
        severity: "error",
      })
      setError(error.messages)
    }
  }

  const validateUrl = (inputString) => {
    try {
      new URL(inputString)
      return true
    } catch (error) {
      setError(t("Please enter a valid URL"))
      return false
    }
  }

  const handleOnChange = (event) => {
    setUrlTextFieldValue(event.target.value)
  }

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <TextField
          error={error !== null}
          name="uploadUrl"
          onChange={(event) => handleOnChange(event)}
          size="small"
          value={urlTextFieldValue}
          label={t("Import from URL")}
          placeholder={t("Type a website URL")}
          helperText={error}
          sx={{
            ".dark & .MuiFormHelperText-root.Mui-error": {
              backgroundColor: "grey.300",
              padding: "8px",
              borderRadius: "0.75rem",
              color: "red !important",
            }
          }}
        />
        <div className="flex justify-between flex-wrap">
          <FormControlLabel
            control={
              <Checkbox
                checked={fetchImages}
                onChange={(event) => setFetchImages(event.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label={t("With Images")}
          />
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<OpenInBrowser />}
            variant="outlined"
            type="button"
            onClick={handleUploadUrl}
          >
            {t("Fetch URL")}
          </LoadingButton>
        </div>
      </div>
    </>
  )
}
