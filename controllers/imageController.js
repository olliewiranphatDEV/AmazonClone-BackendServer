const cloudinary = require('../config/cloudinary')
const TryCatch = require("../utils/TryCatch");

exports.addImageCloud = TryCatch(async (req, res) => {
    console.log('req.body', req.body);
    const results = await cloudinary.uploader.upload(req.body.image, { // Keep Image file on Cloudinary
        folder: "ProductImage",
        public_id: Date.now(),
        resource_type: 'auto'
    })

    res.status(200).json({ message: "SUCCESS, Add Images at Cloudinary!", results }) //send to Frontend, get secure_url to keep in DB
})


exports.delImageCloud = TryCatch(async (req, res) => {
    console.log('req.body', req.body);
    const { public_id } = req.body
    const results = await cloudinary.uploader.destroy(public_id)
    console.log('results', results);


    res.status(200).json({ message: "SUCCESS, Add Images at Cloudinary!" }) //send to Frontend
})
