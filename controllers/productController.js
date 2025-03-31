const TryCatch = require("../utils/TryCatch");
const prisma = require('../models')

// exports.searchProduct = TryCatch(async (req, res) => {
//     console.log('req.query', req.query);
//     const { categoryID, search } = req.query
//     ///// Find Products about these in DB:
//     //Sometiems only have one value, so:
//     const whereCondition = {} //create condition for req.query
//     // if have categoryID :
//     if (categoryID && categoryID !== 'undefined' && categoryID !== '') {
//         whereCondition.categoryID = Number(categoryID) //assign key : value
//     }
//     // if have search word :
//     if (search && search !== 'undefined' && search !== '') {
//         whereCondition.OR = [
//             {
//                 productName: { contains: search, mode: 'insensitive' }
//             },
//             {
//                 description: { contains: search, mode: 'insensitive' }
//             }
//         ]

//     }
//     // console.log('whereCondition', whereCondition);
//     const results = await prisma.product.findMany({
//         where: whereCondition,
//         include: {
//             productImage: true, //JOIN productImage Table
//             category: {
//                 select: {
//                     name: true
//                 }
//             }
//         },
//         orderBy: {
//             createAt: 'desc' //Max-min
//         }
//     })
//     console.log(results);

//     res.status(200).json({ message: "Success SearchProducts" })
// })





// exports.PDCategoryID = TryCatch(async (req, res) => {
//     // console.log('req.params', req.params);
//     const { categoryID } = req.params
//     // console.log('categoryID', categoryID);
//     ///// Find Products about categoryID in DB :
//     const results = await prisma.product.findMany({ where: { categoryID: Number(categoryID) } })

//     res.status(200).json({ message: "Success PDonCategoryID", results })
// })

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
            include: { productImage: true },
            orderBy: {
                createAt: 'desc' //Max-min
            }
        });

        res.status(200).json({ status: "SUCCESS", results });
    } catch (error) {
        next(error)
    }
}


exports.orderPayment = TryCatch(async (req, res) => {
    res.status(200).json({ status: "SUCCESS Order Payment" });
})