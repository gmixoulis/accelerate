import { cookies } from "next/headers"
import jwt_decode from "jwt-decode"

const getServerSideAccessToken = () => {
  let accessToken = ""
  let refreshToken = ""
  let UserID = ""
  let ProfileID = ""
  let UserEmail = ""
  try {
    accessToken = cookies().get("accessToken")
    refreshToken = cookies().get("refreshToken")

    if (accessToken) {
      const decodedToken = jwt_decode(accessToken.value)
      UserID = decodedToken.UserID
      ProfileID = decodedToken.ProfileID
      UserEmail = decodedToken.UserEmail
    }
  } catch (e) {
    console.error("Error:", e.message)
  }

  return {
    UserID: UserID,
    ProfileID: ProfileID,
    UserEmail: UserEmail,
  }
}

export default getServerSideAccessToken
