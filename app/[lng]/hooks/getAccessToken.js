import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"

const getAccessToken = () => {
  let accessToken = ""
  let refreshToken = ""
  let UserID = ""
  let ProfileID = ""
  let UserEmail = ""
  let SessionID = ""
  let TenantID = ""
  let RoleName = ""
  let TenantNativeName = ""

  try {
    accessToken = Cookies.get("accessToken")
    refreshToken = Cookies.get("refreshToken")

    if (accessToken) {
      const decodedToken = jwt_decode(accessToken)
      UserID = decodedToken.UserID
      ProfileID = decodedToken.ProfileID
      UserEmail = decodedToken.UserEmail
      SessionID = decodedToken.SessionID
      TenantID = decodedToken.TenantID
      RoleName = decodedToken.RoleName
      TenantNativeName = decodedToken.TenantNativeName
    }
  } catch (e) {
    console.error("Error:", e.message)
  }

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    UserID: UserID,
    ProfileID: ProfileID,
    UserEmail: UserEmail,
    SessionID: SessionID,
    TenantID: TenantID,
    RoleName: RoleName,
    TenantNativeName: TenantNativeName,
  }
}

export default getAccessToken
