import { useParams, useRouter } from "next/navigation"
import { Typography } from "@material-tailwind/react"
import { Button } from "@mui/material"

import CopyButton from "@/app/[lng]/myfiles/[id]/components/CopyButton"
import { FetchRawText } from "@/app/[lng]/myfiles/[id]/hooks/fetchRawText"
import { UseTranslation } from "@/app/i18n/client"

export default function RawTextView({ rawTextFileID }) {
  const { lng } = useParams()
  const router = useRouter()
  const { t } = UseTranslation(lng, "myfile")
  const [rawText, fetchRawText] = FetchRawText(rawTextFileID)

  const viewRawTextBtn = async () => {
    fetchRawText()
  }

  const redirectToPowerFlowBtn = async () => {
    localStorage.setItem("myfiles", rawText)

    router.push(`/${lng}/powerflow?redirectedFrom=myfiles`)
  }

  return (
    <>
      {rawTextFileID === null ? (
        ""
      ) : (
        <>
          <Typography variant="h2">Raw Text Actions</Typography>
          <Button
            type="button"
            variant="outlined"
            onClick={() => viewRawTextBtn()}
          >
            View Raw Text
          </Button>
          {rawText !== null ? (
            <>
              <div className="flex pt-5">
                <div className="flex-none w-14 h-14">
                  <CopyButton content={rawText} />
                </div>
                <div className="flex-initial w-64 ...">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => redirectToPowerFlowBtn()}
                  >
                    {t("Send to Powerflow")}
                  </Button>
                </div>
              </div>
              {rawText}
            </>
          ) : (
            ""
          )}
        </>
      )}
    </>
  )
}
