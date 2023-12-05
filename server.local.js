let BACKEND_URL

if(process.env.NEXT_PUBLIC_APP_ENV) {
  if (process.env.NEXT_PUBLIC_APP_ENV === "STG") {
    BACKEND_URL = "https://stg-api.accelerate.unic.ac.cy/"
  } else if (process.env.NEXT_PUBLIC_APP_ENV === "PROD") {
    BACKEND_URL = "https://api.accelerate.unic.ac.cy/"
  }
} else {
  //Variable NEXT_PUBLIC_APP_ENV is not set in env
  console.log('JS_APP_ENV or NEXT_PUBLIC_APP_ENV not set!');
  BACKEND_URL = "http://localhost:3000/"
}

export { BACKEND_URL }
