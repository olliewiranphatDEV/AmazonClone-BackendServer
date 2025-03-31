const createError = require("../utils/createError");
const TryCatch = require("../utils/TryCatch");

module.exports = TryCatch(async (req, res, next) => {
    const { publicMetadata: { role } } = req.user
    role !== "ADMIN" && createError(401, "Denied, Only ADMIN pass")
    next()
})