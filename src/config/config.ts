import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  databaseURl: process.env.MONGO_CONNECTION_URI,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  frontendDomain: process.env.FRONTEND_DOMAIN,
};

export const config = Object.freeze(_config);
