const createError = require("../utils/createError");
const TryCatch = require("../utils/TryCatch");

module.exports = TryCatch(async (req, res, next) => {

    const { publicMetadata: { role } } = req.user
    if (role !== "SELLER") {
        return createError(401, "Denied, Only Seller pass")
    }


    next() //next to Controller/next MW
})
