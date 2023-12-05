"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Typography } from "@material-tailwind/react"
import { Cancel, Edit, ExpandMore, Save } from "@mui/icons-material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import TableRowsIcon from "@mui/icons-material/TableRows"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Select,
  Skeleton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"

import DownloadFile from "@/app/[lng]/myfiles/[id]/components/DownloadFile"
import RawTextView from "@/app/[lng]/myfiles/[id]/components/RawTextView"
import RelatedFiles from "@/app/[lng]/myfiles/[id]/components/RelatedFiles"
import WebArticleView from "@/app/[lng]/myfiles/[id]/components/webArticleView"
import { FetchFile } from "@/app/[lng]/myfiles/[id]/hooks/fetchFile"
import { trimText } from "@/app/[lng]/myfiles/helpers/trimText"
import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"
import { UseTranslation } from "@/app/i18n/client"
import { ErrorStatusType, Log } from "@/app/utils/DatadogBrowserLogs"

import styles from "./../styles/myfiles.module.css"

const bytesToMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2)
}

const getRawTextFileID = (file) => {
  if (file === undefined) return null

  const rawFile = file.RelatedFiles?.find((x) => x.Type === "raw-text")

  if (!rawFile) {
    return null
  }

  return rawFile.RelatedFile.FileID
}
export default function SingleFileView({ params }) {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")
  const [editField, setEditField] = useState({
    Name: false,
    Alt: false,
  })
  const inputRefs = useRef({})
  const router = useRouter()
  const searchParams = useSearchParams()

  const [fileScreenshotUrl, setFileScreenshotUrl] = useState(null)
  const [goBackTo, setGoBackTo] = useState(null)

  const [licenses, setLicenses] = useState(null)
  const [selectedLicense, setSelectedLicense] = useState("")

  const [relatedFilesView, setRelatedFilesView] = useState("table")

  const [file, reloadFile] = FetchFile(params.id)

  const setRef = (name, el) => {
    inputRefs.current[name] = el
  }

  const setEditMode = (field, value) => {
    setEditField({
      ...editField,
      [field]: value,
    })
  }

  const requestMetadataExtraction = () => {
    const requestMetadataExtractionBackendCall = async () => {
      await MyFilesService.requestMetadataExtraction(params.id)
    }

    requestMetadataExtractionBackendCall()
      .then(() => {
        setFiles({
          ...file,
          Metadata: {},
        })
      })
      .catch((err) => {
        Log(
          "Failed tor equest metadata extraction",
          ErrorStatusType.error,
          "SingleFileView",
          "requestMetadataExtraction",
          err
        )
        console.log(err)
        throw err
      })
  }

  const saveField = (field) => {
    const updateDB = async () => {
      let value = inputRefs.current[field].value
      // If license is none, set it to 0
      if (field === "LicenseID" && value === "none") {
        value = 0
      }
      await MyFilesService.updateFile(params.id, {
        [field]: value,
      })
    }
    updateDB().then(() => {
      reloadFile()
      setEditMode(field, false)
    })
  }

  const handleLicenseSelectChange = (event) => {
    setSelectedLicense(event.target.value)
  }

  // Set Screenshot
  useEffect(() => {
    if (file) {
      if (file?.FileType.FileTypeFamily === "image") {
        setFileScreenshotUrl(file.PrivateUrl)
      } else {
        const screenshotFile = file?.RelatedFiles.find(
          (x) => x.Type === "screenshot"
        )

        if (screenshotFile !== undefined) {
          setFileScreenshotUrl(screenshotFile.RelatedFile.PrivateUrl)
        }
      }
    }
  }, [file])

  // Get Licenses
  useEffect(() => {
    const fetchLicenses = async () => {
      return await MyFilesService.getLicenses()
    }

    fetchLicenses()
      .then((response) => {
        setLicenses(response.data)
      })
      .catch((e) => {
        Log(
          "Error fetching licenses",
          ErrorStatusType.error,
          "SingleFileView",
          "fetchLicenses",
          e
        )
        // console.log("Error fetching licenses")
      })
  }, [])

  useEffect(() => {
    const redirecToFileID = searchParams.get("redirect")

    if (redirecToFileID !== null) {
      setGoBackTo(redirecToFileID)
    }
  }, [file, searchParams])

  return (
    <>
      <Button
        color="error"
        aria-label="Back"
        variant="contained"
        className="!mb-4"
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          goBackTo === null
            ? router.push(`/${lng}/myfiles`)
            : router.push(`/${lng}/myfiles/${goBackTo}`)
        }
      >
        {t("Back")}
      </Button>
      <Grid container rowSpacing={1} spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={1}>
            <Grid item xs={12}>
              {fileScreenshotUrl ? (
                <>
                  <picture className={styles.fileScreenshotWrapper}>
                    <img
                      src={fileScreenshotUrl}
                      alt={file.Alt ?? t("No alt text")}
                    />
                    <Link href={fileScreenshotUrl} target={"_blank"}>
                      <div>
                        <ZoomInIcon fontSize="inherit" />
                      </div>
                    </Link>
                  </picture>
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <DownloadFile file={file}></DownloadFile>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container rowSpacing={4} spacing={{ xs: 2, md: 5 }}>
            <Grid item xs={12} md={12}>
              <Typography variant="h1">{t("Info")}</Typography>
              {file ? (
                <>
                  <div>
                    {(() => {
                      const fieldName = "Name"
                      return editField[fieldName] ? (
                        <>
                          <Grid container rowSpacing={1} alignItems={"center"}>
                            <Grid item xs={12} md={2}>
                              <Typography variant="paragraph">
                                {t("File {fieldName}.Name")}:{" "}
                              </Typography>
                            </Grid>
                            <Grid item xs={9} md>
                              <TextField
                                inputRef={(el) => setRef(fieldName, el)}
                                name={fieldName}
                                size={"small"}
                                defaultValue={file[fieldName]}
                                fullWidth
                              ></TextField>
                            </Grid>
                            <Grid item xs={3} md={4}>
                              <IconButton
                                aria-label="save"
                                size="small"
                                onClick={() => saveField(fieldName)}
                                className="dark:text-white"
                              >
                                <Save fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                aria-label="cancel"
                                size="small"
                                onClick={() => setEditMode(fieldName, false)}
                                className="dark:text-white"
                              >
                                <Cancel fontSize="inherit" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid container rowSpacing={1}>
                            <Grid item xs={10} md>
                              <Typography variant="paragraph">
                                {`${t("File {fieldName}.Name")}: ${trimText(
                                  file[fieldName]
                                )}`}
                              </Typography>
                            </Grid>
                            <Grid item xs={2} md={6}>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => setEditMode(fieldName, true)}
                                className="dark:text-white"
                              >
                                <Edit fontSize="inherit" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </>
                      )
                    })()}
                  </div>
                  {file.FileType.FileTypeFamily === "web-document" ? (
                    <Typography variant="paragraph">
                      {t("Requested by:")}{" "}
                      {file.Uploader && file.Uploader.UserHandle}
                    </Typography>
                  ) : (
                    <Typography variant="paragraph">
                      {t("Uploaded by:")}{" "}
                      {file.Uploader && file.Uploader.UserHandle}
                    </Typography>
                  )}
                  <div>
                    {file?.FileType.FileTypeFamily === "image" &&
                      (() => {
                        const fieldName = "Title"
                        return editField[fieldName] ? (
                          <>
                            <Grid container rowSpacing={1} alignItems="center">
                              <Grid item xs={12} md={2}>
                                <Typography variant="paragraph">
                                  {t("File {fieldName}.Title")}:
                                </Typography>
                              </Grid>
                              <Grid item xs={9} md>
                                <TextField
                                  inputRef={(el) => setRef(fieldName, el)}
                                  name={fieldName}
                                  size={"small"}
                                  defaultValue={file[fieldName]}
                                  fullWidth
                                ></TextField>
                              </Grid>
                              <Grid item xs={3} md={4}>
                                <IconButton
                                  aria-label="save"
                                  size="small"
                                  onClick={() => saveField(fieldName)}
                                  className="dark:text-white"
                                >
                                  <Save fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                  aria-label="cancel"
                                  size="small"
                                  onClick={() => setEditMode(fieldName, false)}
                                  className="dark:text-white"
                                >
                                  <Cancel fontSize="inherit" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid container rowSpacing={1}>
                              <Grid item xs={10} md>
                                <Typography variant="paragraph">
                                  {`${t("File {fieldName}.Title")}: ${trimText(
                                    file[fieldName]
                                  )}`}
                                </Typography>
                              </Grid>
                              <Grid item xs={2} md={6}>
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  onClick={() => setEditMode(fieldName, true)}
                                  className="dark:text-white"
                                >
                                  <Edit fontSize="inherit" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </>
                        )
                      })()}
                  </div>
                  <div>
                    {(() => {
                      const fieldName = "Alt"
                      return editField[fieldName] ? (
                        <>
                          <Grid container rowSpacing={1} alignItems="center">
                            <Grid item xs={9} md={2}>
                              <Typography variant="paragraph">
                                {t("File {fieldName}.Alt")}:
                              </Typography>
                            </Grid>
                            <Grid item xs={9} md>
                              <TextField
                                inputRef={(el) => setRef(fieldName, el)}
                                name={fieldName}
                                size={"small"}
                                defaultValue={file[fieldName]}
                                fullWidth
                                margin="dense"
                              ></TextField>
                            </Grid>
                            <Grid item xs={3} md={4}>
                              <IconButton
                                aria-label="save"
                                size="small"
                                onClick={() => saveField(fieldName)}
                                className="dark:text-white"
                              >
                                <Save fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                aria-label="cancel"
                                size="small"
                                onClick={() => setEditMode(fieldName, false)}
                                className="dark:text-white"
                              >
                                <Cancel fontSize="inherit" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid container rowSpacing={1}>
                            <Grid item xs={10} md>
                              <Typography variant="paragraph">
                                {`${t("File {fieldName}.Alt")}: ${trimText(
                                  file[fieldName]
                                )}`}
                              </Typography>
                            </Grid>
                            <Grid item xs={2} md={6}>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => setEditMode(fieldName, true)}
                                className="dark:text-white"
                              >
                                <Edit fontSize="inherit" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </>
                      )
                    })()}
                  </div>
                  <Typography variant="paragraph">
                    {t("App Owner:")} {file.App && file.App.AppName}
                  </Typography>
                  <Typography variant="paragraph">
                    {" "}
                    {t("File Type:")}{" "}
                    {file.FileType && file.FileType.FileTypeMime}
                  </Typography>
                  {file.Metadata?.Size && (
                    <Typography variant="paragraph">
                      {t("File Size:")} {bytesToMB(file.Metadata?.Size)} MB
                    </Typography>
                  )}
                  {file.FileType.FileTypeFamily === "image" && (
                    <>
                      {file.Metadata?.Width && (
                        <Typography variant="paragraph">
                          {t("File Dimensions:")} {file.Metadata?.Width} x{" "}
                          {file.Metadata?.Height}
                        </Typography>
                      )}
                      {file.Metadata?.Latitude && (
                        <Typography variant="paragraph">
                          {t("File GPS")}:
                          <Link
                            href={`https://www.google.com/maps/place/${file.Metadata?.Latitude},${file.Metadata?.Longitude}`}
                            target="_blank"
                            className="underline decoration-1 focus:text-blue-600"
                          >
                            {file.Metadata?.Latitude},{file.Metadata?.Longitude}
                          </Link>
                        </Typography>
                      )}
                    </>
                  )}

                  <div>
                    {(() => {
                      const fieldName = "LicenseID"
                      return editField[fieldName] ? (
                        <>
                          <Grid
                            container
                            rowSpacing={1}
                            alignItems="flex-start"
                          >
                            <Grid item xs={6}>
                              <Typography variant="paragraph">
                                {t("Creative Commons / Open Content Licenses:")}
                              </Typography>
                              <Typography
                                variant="paragraph"
                                className="dark:text-white pt-1 pb-1 text-sm"
                              >
                                {t("Select a Creative Commons license...")}
                              </Typography>
                              <FormControl
                                sx={{ my: 1, minWidth: 200 }}
                                size="small"
                              >
                                <InputLabel id="select-license-label">
                                  {t("Select License")}
                                </InputLabel>
                                <Select
                                  labelId="select-license-label"
                                  inputRef={(el) => setRef(fieldName, el)}
                                  name={fieldName}
                                  size={"small"}
                                  value={
                                    selectedLicense ||
                                    file.License?.LicenseID ||
                                    "none"
                                  }
                                  autoWidth
                                  onChange={handleLicenseSelectChange}
                                  label="Select License"
                                >
                                  <MenuItem value="none">{t("None")}</MenuItem>
                                  {licenses &&
                                    licenses.map((license) => {
                                      return (
                                        <MenuItem
                                          key={license.LicenseID}
                                          value={license.LicenseID}
                                        >
                                          {license.LicenseName}
                                        </MenuItem>
                                      )
                                    })}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                              <IconButton
                                aria-label="save"
                                size="small"
                                onClick={() => saveField(fieldName)}
                                className="dark:text-white"
                              >
                                <Save fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                aria-label="cancel"
                                size="small"
                                onClick={() => {
                                  setEditMode(fieldName, false)
                                  setSelectedLicense(file.License?.LicenseID)
                                }}
                                className="dark:text-white"
                              >
                                <Cancel fontSize="inherit" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid container rowSpacing={1}>
                            <Grid item xs={10} md={6}>
                              <Typography variant="paragraph">
                                {t("Creative Commons / Open Content Licenses:")}{" "}
                                {file.License?.LicenseName ?? t("None")}
                              </Typography>
                            </Grid>
                            <Grid item xs={2} md={6}>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => setEditMode(fieldName, true)}
                                className="dark:text-white"
                              >
                                <Edit fontSize="inherit" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </>
                      )
                    })()}
                  </div>
                  {file.MonitoredWebsite &&
                    file.FileType.FileTypeFamily === "web-document" && (
                      <>
                        <Grid container rowSpacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="paragraph">
                              URL:{" "}
                              <Link
                                href={file.MonitoredWebsite?.WebsiteURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-1 focus:text-blue-600"
                              >
                                {file.MonitoredWebsite?.WebsiteURL}
                              </Link>
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                </>
              ) : (
                <>
                  <p>
                    <Skeleton variant="rectangular" width={300} />
                  </p>
                  <p>
                    <Skeleton variant="rectangular" width={200} />
                  </p>
                  <p>
                    <Skeleton variant="rectangular" width={250} />
                  </p>
                  <p>
                    <Skeleton variant="rectangular" width={100} />
                  </p>
                </>
              )}
            </Grid>
            <Grid item xs={12} md={9}>
              {file?.Metadata ? (
                <>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{
                        backgroundColor: "#f1f1f1",
                      }}
                    >
                      {t("Advanced Metadata")}
                    </AccordionSummary>
                    <AccordionDetails className="min-h-0 h-52 overflow-scroll">
                      <pre>
                        {file.Metadata?.Additional
                          ? JSON.stringify(file.Metadata.Additional, null, 2)
                          : t("Request for Metadata extraction in progress")}
                      </pre>
                    </AccordionDetails>
                  </Accordion>
                </>
              ) : (
                <>
                  <Button onClick={() => requestMetadataExtraction()}>
                    {t("Request Metadata Extraction")}
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}></Grid>
        <Grid item xs={12} md={6}></Grid>
      </Grid>
      <Grid container className={"pt-4"} rowGap={2} alignItems={"baseline"}>
        <Grid item xs={12}>
          {file?.FileType.FileTypeFamily === "document" && (
            <>
              <RawTextView rawTextFileID={getRawTextFileID(file)}></RawTextView>
            </>
          )}
          <Box
            sx={{
              backgroundColor: "transparent",
              padding: "1rem",
            }}
            className="text-black dark:text-white"
          >
            {file?.FileType.FileTypeFamily === "web-document" && (
              <WebArticleView monitoredWebsiteID={file?.MonitoredWebsiteID} />
            )}
          </Box>
        </Grid>

        <Grid item xs={10}>
          <Typography variant={"h1"} className={"text-7xl"}>
            {t("Related Files")}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <ToggleButtonGroup
            variant="outlined"
            color="primary"
            value={relatedFilesView}
            onChange={(event, newValue) => {
              setRelatedFilesView(newValue)
            }}
            exclusive
          >
            <ToggleButton value="table" className="flex gap-2 dark:text-white">
              <TableRowsIcon />
              {t("Table")}
            </ToggleButton>
            <ToggleButton value="grid" className="flex gap-2 dark:text-white">
              <ViewModuleIcon />
              {t("Grid")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {file && (
            <RelatedFiles
              file={file}
              reloadFile={reloadFile}
              view={relatedFilesView}
            />
          )}
        </Grid>
      </Grid>
    </>
  )
}
