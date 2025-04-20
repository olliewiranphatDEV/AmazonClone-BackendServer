const multer = require("multer");

// ✅ ตั้งค่า Multer ให้เก็บไฟล์ไว้ใน Memory (Buffer)
const storage = multer.memoryStorage();

// ✅ ตรวจสอบว่าเป็นไฟล์ภาพ
const fileFilter = (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
        cb(null, true); // ✅ อนุญาตให้อัปโหลด
    } else {
        console.log("❌ Unsupported file type:", file.mimetype); // Debug
        cb(null, false); // ❌ ปฏิเสธไฟล์ที่ไม่ใช่รูปภาพ
    }
};

// ✅ ใช้ fileFilter และ memoryStorage
const upload = multer({ storage, fileFilter });

module.exports = upload;