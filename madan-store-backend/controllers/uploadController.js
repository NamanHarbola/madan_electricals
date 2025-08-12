// controllers/uploadController.js
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // The file is uploaded to Cloudinary by the middleware.
  // We just need to send back the URL.
  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path // This contains the secure URL from Cloudinary
  });
};

module.exports = {
  uploadImage,
};