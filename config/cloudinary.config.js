const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});


const uploadImageCloudinary = async (file) => {
    let res = await cloudinary.uploader.upload(file);
    return res.secure_url;
}

module.exports = uploadImageCloudinary;