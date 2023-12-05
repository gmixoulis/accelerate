import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BACKEND_URL } from "@/server"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"

import Dropdown from "@/app/[lng]/account-page/preferences/components/Dropdown"
import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import { UseTranslation } from "@/app/i18n/client"

export default function SocialMediaModal({
  open,
  handleClose,
  onAddSocialMedia,
}) {
  const [socialMediaList, setSocialMediaList] = useState([])
  const [selectedSocialMedia, setSelectedSocialMedia] = useState(null)
  const [loading, setLoading] = useState(true)

  async function socialMedias() {
    return await axiosRequest(BACKEND_URL + "social-media/")
  }

  useEffect(() => {
    // Fetch the social media list from the API
    socialMedias()
      .then((response) => {
        setSocialMediaList(
          response.data.SocialMedias.sort((a, b) => {
            const siteNameA = a.SiteName.toLowerCase()
            const siteNameB = b.SiteName.toLowerCase()

            if (siteNameA < siteNameB) {
              return -1
            }
            if (siteNameA > siteNameB) {
              return 1
            }
            return 0
          })
        )
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching social media data: ", error)
        setLoading(true)
      })
  }, [])

  const handleAddSocialMedia = () => {
    if (selectedSocialMedia) {
      setSelectedSocialMedia(selectedSocialMedia)
      onAddSocialMedia(
        socialMediaList.filter((item) => {
          if (item.SiteName == selectedSocialMedia) return item
        })
      )
    }

    handleClose()
  }

  const handleCancel = () => {
    handleClose()
  }

  const { lng } = useParams()
  const { t } = UseTranslation(lng, "socials")

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"sm"}>
      <div className="flex items-center justify-between dark:bg-darkslategray-100 dark:text-white">
        <DialogTitle className="dark:bg-darkslategray-100 dark:text-white">
          {t("Add Social Media")}
        </DialogTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 mr-3 hover:cursor-pointer"
          onClick={handleClose}
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <DialogContent className="dark:bg-darkslategray-100 dark:text-white">
        <h3 className="mb-2 text-lg font-medium text-dimgray-100 dark:text-white ">
          {t("Select a social media platform")}
        </h3>
        <Dropdown
          className="dark:bg-darkslategray-100 dark:text-white !z-999"
          options={socialMediaList.sort((a, b) => a - b)}
          selected={selectedSocialMedia}
          setSelected={setSelectedSocialMedia}
        />
      </DialogContent>
      <DialogActions className="dark:bg-darkslategray-100 dark:text-white">
        <Button
          onClick={handleCancel}
          variant="outlined"
          className="hover:bg-whitesmoke !capitalize  !dark:bg-gray-500 !text-dimgray-200 border-[0.5px] !border-dimgray-200 border-solid font-light rounded-lg h-11 w-44"
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={handleAddSocialMedia}
          variant="contained"
          className="font-light !capitalize rounded-lg !bg-dimgray-200 !dark:bg-darkslategray-100 !hover:bg-dimgray-100 !text-whitesmoke h-11 w-44"
        >
          {t("Add")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
