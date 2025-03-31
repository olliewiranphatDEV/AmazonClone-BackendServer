const createError = require("../utils/createError");
const TryCatch = require("../utils/TryCatch");
const prisma = require('../models/index')




///// API Get All-Products : http://localhost:8080/seller-center/products/all-products/${userID}, token
/// MerchantData = SellerData (req.user) + productSeller (Product Table - SellerID in DB)
exports.getMyProducts = TryCatch(async (req, res) => {
    const { userID } = req.params
    // console.log('userID', userID);
    const results = await prisma.product.findMany({
        where: { userID: Number(userID) },
        include: { productImage: true }
    })
    console.log('results', results);

    res.status(200).json({ message: "SUCESS! Get all products!", results })
})



///// API Seller ADD Product : /seller-center/add-product
exports.sellerADDProduct = TryCatch(async (req, res) => { //Only SELLER get to this path
    console.log("clerkID", req.user.id);
    ///// Get userID in DB where clerkID :
    const userDataDB = await prisma.user.findFirst({ where: { clerkID: req.user.id } })
    console.log('userDataDB >>>', userDataDB);
    !userDataDB && createError(400, "Not found this user")
    ///// get userID to add in Product Table :
    const { userID } = userDataDB
    console.log('userID >>>', userID);

    const { value, imageData } = req.body
    console.log('imageData', imageData); //[]

    // console.log('value >>>', value); //for keep in Product
    ///// Add Product in DB :
    const productData = await prisma.product.create({
        data: { userID, ...value, categoryID: Number(value.categoryID), price: Number(value.price), stockQuantity: Number(value.stockQuantity) }
    })
    console.log('productData >>>', productData);
    ///// get ProductID where ProductName: to add ProductImage in DB, using productID
    const productDB = await prisma.product.findFirst({ where: { productID: parseInt(productData.productID) } })

    ///// Add ImageProduct into DB:
    const productImages = await prisma.productImage.createMany({
        data: imageData.map(({ secure_url, public_id }) => {
            return { productID: productDB.productID, productImage: secure_url, public_id }
        })
    })
    console.log('productImages', productImages);
    res.status(200).json({ status: "SUCCESS", message: "Add product already!", results: { ...productData, ...productImages } })
})

exports.sellerUPDATEProduct = TryCatch(async (req, res) => {
    console.log('req.params:', req.params);
    console.log('value:', req.body.value);
    console.log('imageData:', req.body.imageData); //from Cloundinary (Delete Old Images, and Add New Images)

    const { value, imageData } = req.body;
    const productID = parseInt(req.params.productID);

    if (!productID) {
        return res.status(400).json({ status: "ERROR", message: "Invalid Product ID" });
    }

    // Step 1: Update Product Details (excluding images)
    const updatedProduct = await prisma.product.update({
        where: { productID: parseInt(req.params.productID) },
        data: {
            ...value,
            categoryID: parseInt(value.categoryID),
            price: parseInt(value.price),
            stockQuantity: parseInt(value.stockQuantity)
        }
    });

    console.log('Updated Product:', updatedProduct);

    // Step 2: Handle Image Updates
    if (imageData && imageData.length > 0) {
        // Option 1: Delete old images before inserting new ones (Recommended if replacing all images)
        await prisma.productImage.deleteMany({ where: { productID: parseInt(req.params.productID) } });

        // Insert new images
        const UpdateImages = await prisma.productImage.createMany({
            data: imageData.map(el => ({
                productID: parseInt(req.params.productID),
                productImage: el.secure_url || el.productImage,
                public_id: el.public_id
            }))
        });
        console.log('Images replaced successfully.', UpdateImages);
    }
    res.status(200).json({ status: "SUCCESS", message: "Product updated successfully!" });
});

exports.sellerDELETEProduct = TryCatch(async (req, res) => {
    console.log(' req.param', req.params);
    console.log("DELETE ProductID");

    const results = await prisma.product.deleteMany({
        where: { productID: parseInt(req.params.productID) }
    })
    console.log('results', results);

    ///// Find : customer(userData), all-products, ProductonOrder, Order-TotalPrice(Sale), rating, reviewPost
    res.status(200).json({ status: "SUCCESS", message: "Delete Product already!" })
})


///// API Seller Dashboard : /seller-center/dashboard --> SellerData-ProductData-OrderData-ProductOnOrder
exports.sellerDashboard = TryCatch(async (req, res) => {
    console.log(' req.user', req.user);
    console.log(' req.param', req.params);

    ///// Find : customer(userData), all-products, ProductonOrder, Order-TotalPrice(Sale), rating, reviewPost
    res.status(200).json({ status: "SUCCESS", message: "Access Dashboard already!" })
})