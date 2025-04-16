import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

//Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const uploader = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
    console.log("Successfully uploaded on cloudinary ",uploader.url);
    fs.unlinkSync(localFilePath)
    return uploader

  } catch (error) {
    console.log("Failed to upload on cloudinary!")
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null
  }
};

export {uploadOnCloudinary}
