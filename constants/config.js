export const CONFIG = {
  app: {
    NEXT_PUBLIC_APP_URI: process.env.NEXT_PUBLIC_APP_URI
  },
  authentication: {
    FB_PRIVATE_KEY: process.env.NEXT_PUBLIC_FB_PRIVATE_KEY,
    FB_CLIENT_EMAIL: process.env.NEXT_PUBLIC_FB_CLIENT_EMAIL,
    FB_PROJECT_ID: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    FB_DATABASE_URL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
    FB_API_KEY: process.env.NEXT_PUBLIC_FB_API_KEY,
    FB_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    FB_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
    FB_APP_ID: process.env.NEXT_PUBLIC_FB_APP_ID,
    FB_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID
  },
  database: {
    DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL
  },
  contact: {
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    WHATSAPP_URL: process.env.WHATSAPP_URL,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  },
  storage: {
    DCM_AWS_BUCKET_NAME: process.env.DCM_AWS_BUCKET_NAME,
    DCM_AWS_REGION: process.env.DCM_AWS_REGION,
    DCM_AWS_SECRET_KEY: process.env.DCM_AWS_SECRET_KEY,
    DCM_AWS_ACCESS_KEY: process.env.DCM_AWS_ACCESS_KEY,
    DCM_AWS_ENDPOINT: process.env.DCM_AWS_ENDPOINT
  }
}
