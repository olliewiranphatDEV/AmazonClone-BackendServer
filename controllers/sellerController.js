const createError = require("../utils/createError");
const TryCatch = require("../utils/TryCatch");
const prisma = require('../models/index');
const { clerkClient } = require("@clerk/express");

exports.switchToSeller = TryCatch(async (req, res) => {
    console.log('req.user', req.user);

    if (req.body.role !== "SELLER") {
        return createError(400, "Bad request!, no have SELLER ROLE")
    }
    await clerkClient.users.updateUserMetadata(req.user.id, {
        publicMetadata: { role: req.body.role }
    })


    const result = await prisma.user.upsert({
        where: { clerkID: req.user.id },
        create: {
            clerkID: req.user.id,
            role: req.body.role,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.emailAddresses[0].emailAddress
        },
        update: {
            role: req.body.role
        }
    })

    res.status(200).json({ message: "SUCESS, Switch to SELLER!!", result })
})

exports.editMerchantName = TryCatch(async (req, res) => {
    console.log('req.body', req.body);

    const results = await prisma.user.update({
        where: {
            clerkID: req.user.id
        },
        data: {
            merchantName: req.body.merchantName
        }
    })
    console.log('results', results);

    res.status(200).json({ message: "SUCESS! Edit Merchant Name already", results })
})


///// API Get All-Products : http://localhost:8080/seller-center/products/all-products/${userID}, token
/// MerchantData = SellerData (req.user) + productSeller (Product Table - SellerID in DB)
exports.getMyProducts = TryCatch(async (req, res) => {
    // console.log('req.user', req.user);
    const results = await prisma.product.findMany({
        where: { sellerID: req.user.id },
        include: {
            ProductImage: true
        }
    })
    // console.log('results', results);

    res.status(200).json({ message: "SUCESS! Get all products!", results })
})



///// API Seller ADD Product : /seller-center/add-product
exports.sellerADDProduct = TryCatch(async (req, res) => { //Only SELLER get to this path
    const { value, imageData } = req.body
    console.log('value', value);
    console.log('imageData', imageData); //[]
    if (!value || !imageData) {
        return createError("400", "The data do not compelete!")
    }
    ///// VALIDATE HAVE THIS USER?? in DB :
    const userDataDB = await prisma.user.findUnique({
        where: {
            clerkID: req.user.id
        }
    })
    // console.log('userDataDB >>>', userDataDB);
    if (!userDataDB) {
        return createError(404, "Not found this user")
    }

    ///// Add productData in DB :
    const productData = await prisma.product.create({
        data: {
            sellerID: userDataDB.clerkID,
            productName: value.productName,
            description: value.description,
            categoryID: parseInt(value.categoryID),
            price: parseFloat(value.price),
            stockQuantity: parseInt(value.stockQuantity),
            ProductImage: {
                createMany: {
                    data: imageData.map(({ secure_url, public_id }) => (
                        {
                            secure_url,
                            public_id,
                        }
                    ))
                }
            }
        },
        include: {
            ProductImage: true
        }
    })

    console.log('productData', productData);



    res.status(200).json({ status: "SUCCESS", message: "Add product already!" })
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
    const updatedProductInfo = await prisma.product.update({
        where: { productID: parseInt(req.params.productID) },
        data: {
            ...value,
            categoryID: parseInt(value.categoryID),
            price: parseFloat(value.price),
            stockQuantity: parseInt(value.stockQuantity)
        }
    });

    console.log('Updated Product:', updatedProductInfo);

    // Step 2: Handle Image Updates
    if (imageData && imageData.length > 0) {

        // Option 1: Delete old images before inserting new ones (Recommended if replacing all images)
        await prisma.productImage.deleteMany({
            where: {
                productID: parseInt(req.params.productID)
            }
        });

        // Insert new images
        const updateProductImages = await prisma.productImage.createMany({
            data: imageData.map(el => ({
                productID: updatedProductInfo.productID,
                secure_url: el.secure_url,
                public_id: el.public_id
            }))
        });
        console.log('Images replaced successfully.', updateProductImages);
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