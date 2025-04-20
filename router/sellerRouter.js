const express = require('express')
const sellerRouter = express.Router()

const authorization = require('../middlewares/authorization')
const checkSeller = require('../middlewares/checkSeller')
const { sellerRegister, sellerSignin, sellerMerchant, sellerAccount, sellerDashbord, sellerDashboard, getAllProducts, getMyProductsData, getProductImage, getMyProducts, sellerADDProduct, sellerUPDATEProduct, sellerDELETEProduct, switchToSeller, editMerchantName } = require('../controllers/sellerController')
const { addproductImage, addImageCloud, delImageCloud } = require('../controllers/imageController')
const imageMulter = require('../middlewares/imageMulter')
const upload = require('../middlewares/imageMulter')

sellerRouter.put('/switch-to-seller', authorization, switchToSeller)
sellerRouter.put('/user/my-merchant-name', authorization, checkSeller, editMerchantName)

///// SELLER for Product :                  verify Token      role
sellerRouter.get('/products/all-products', authorization, checkSeller, getMyProducts)
///// ADD Product :
sellerRouter.post('/products/add-product', authorization, checkSeller, sellerADDProduct)
///// UPDATE Prodcut :
sellerRouter.put('/products/update-product/:productID', authorization, checkSeller, sellerUPDATEProduct)
///// DELETE Product :
sellerRouter.delete('/products/delete-product/:productID', authorization, checkSeller, sellerDELETEProduct)

///// Images Product by Cloudinary : 
sellerRouter.post('/products/add-images-cloud', authorization, checkSeller, upload.single("image"), addImageCloud) //Cloudinary Storage : Keep Images
sellerRouter.delete(`/products/delete-image-cloud`, authorization, checkSeller, delImageCloud) //Cloudinary Storage : delete Old Images


//DASHBOARD
sellerRouter.get('/dashboard/:userID', authorization, checkSeller, sellerDashboard) //seller-center/dashboard

module.exports = sellerRouter




