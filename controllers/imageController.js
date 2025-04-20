const cloudinary = require('../config/cloudinary');
const createError = require('../utils/createError');
const TryCatch = require("../utils/TryCatch");

exports.addImageCloud = TryCatch(async (req, res) => {
    if (!req.file) {
        return createError(400, "No file uploaded");
    }

    // ✅ แปลง Buffer เป็น base64 data URI
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    try {
        const results = await cloudinary.uploader.upload(base64Image, {
            folder: "ProductImage",
            public_id: Date.now(),
            resource_type: 'auto',
        });

        if (!results) {
            return createError(500, "Error uploading to Cloudinary!");
        }

        res.status(200).json({
            message: "SUCCESS, Add Images at Cloudinary!",
            results: { secure_url: results.secure_url, public_id: results.public_id }
        });
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return createError(500, "Error uploading to Cloudinary");
    }
});





exports.delImageCloud = TryCatch(async (req, res) => {
    console.log('req.query', req.query);

    const results = await cloudinary.uploader.destroy(req.query.public_id)
    console.log('results', results);


    res.status(200).json({ message: "SUCCESS, Add Images at Cloudinary!" }) //send to Frontend
})
