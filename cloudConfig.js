const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "dw5xhhocf",
    api_key:"726161837981812",
    api_secret: "WWpzbg8warvwuh8r01PNC_MBJMk",
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Student Innovation Center',
      allowerdFormats:["png","jpg","jpeg"], // supports promises as well
      
    },
  });

  module.exports={
    cloudinary,
    storage,
  }