const express = require('express')
const sellerRouter = express.Router()

const authorization = require('../middlewares/authorization')
const checkSeller = require('../middlewares/checkSeller')
const { sellerRegister, sellerSignin, sellerMerchant, sellerAccount, sellerDashbord, sellerDashboard, getAllProducts, getMyProductsData, getProductImage, getMyProducts, sellerADDProduct, sellerUPDATEProduct, sellerDELETEProduct } = require('../controllers/sellerController')
const { addproductImage, addImageCloud, delImageCloud } = require('../controllers/imageController')

sellerRouter.get('/dashboard/:userID', authorization, checkSeller, sellerDashboard) //seller-center/dashboard

///// SELLER for Product :                         verify Token      role
sellerRouter.get('/products/all-products/:userID', authorization, checkSeller, getMyProducts)

///// Images Product by Cloudinary : 
sellerRouter.post('/products/add-images-cloud', authorization, checkSeller, addImageCloud) //Cloudinary Storage : Keep Images
sellerRouter.post('/products/delete-images-cloud', authorization, checkSeller, delImageCloud) //Cloudinary Storage : delete Old Images

///// ADD Product :
sellerRouter.post('/products/add-product', authorization, checkSeller, sellerADDProduct)
///// UPDATE Prodcut :
sellerRouter.put('/products/update-product/:productID', authorization, checkSeller, sellerUPDATEProduct)
///// DELETE Product :
sellerRouter.delete('/products/delete-product/:productID', authorization, checkSeller, sellerDELETEProduct)



module.exports = sellerRouter




