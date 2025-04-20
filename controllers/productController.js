const TryCatch = require("../utils/TryCatch");
const prisma = require('../models')


exports.searchProducts = async (req, res, next) => {
    try {
        const { categoryID, search } = req.query;

        let whereClause = {};

        // If categoryID is provided, add it to the filter
        if (categoryID) {
            whereClause.categoryID = parseInt(categoryID);
        }

        // If search is provided, perform a case-insensitive search
        if (search) {
            whereClause.productName = {
                contains: search,
                // Prisma case-insensitive search
            };
            whereClause.description = {
                contains: search,
                // Prisma case-insensitive search
            };
        }

        // Fetch products based on the dynamic whereClause
        const results = await prisma.product.findMany({
            where: whereClause, //categoryID, searchWord : productName, description
            include: {
                ProductImage: true,
                category: true
            },
            orderBy: {
                createAt: 'desc' //Max-min
            }
        });
        console.log('results', results);

        res.status(200).json({ status: "SUCCESS", results });
    } catch (error) {
        next(error)
    }
}


exports.orderPayment = TryCatch(async (req, res) => {
    res.status(200).json({ status: "SUCCESS Order Payment" });
})