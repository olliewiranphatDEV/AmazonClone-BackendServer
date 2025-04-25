const express = require('express')
const userRouter = express.Router()
const authorization = require('../middlewares/authorization')

const { userRegister, userSignin, userOrderHistory, userCart, deleteUser, userCreateUpdateDB, ADDtoCart, userMyAccount, OrderProducts, updateQuantity, paymentCheckout, paymentStatus, updateImageAccount, deleteAllCartItem } = require('../controllers/userController')
const { searchProducts, orderPayment } = require('../controllers/productController')
const { addImageCloud } = require('../controllers/imageController')

///// User SEARCH Product:
userRouter.get('/search-products', searchProducts)
userRouter.post('/product-detail/order/payment', orderPayment)


///// DONT USE THESE NOW : GOT USER DATA FROM CLERK!!
userRouter.post('/register', userRegister)
userRouter.post('/signin', userSignin)


///// when USER got Token from CLERK : will go to another path
//// USER DATA, TOKEN FROM CLERK : IF NO CLERKID in DB --> Create, IF HAVE CLERKID --> Update UserDATA in DB 
userRouter.get('/my-account', authorization, userMyAccount)
userRouter.put('/update-account', authorization, userCreateUpdateDB) //Create/Update in DB
userRouter.patch('/update-image-account', authorization, updateImageAccount) //Update imageUrl in DB
userRouter.post('/add-images-cloud', authorization, addImageCloud) //Cloudinary Storage : Keep Images
userRouter.delete('/delete-account', authorization, deleteUser)
userRouter.post('/add-to-cart', authorization, ADDtoCart)
userRouter.get('/cart', authorization, userCart)
userRouter.get('/cart/delete-all-cart-items', authorization, deleteAllCartItem)
userRouter.patch('/cart/update-quantity', authorization, updateQuantity) //Ready to ORDER, link to Payment Checkout


///// Payment: 
userRouter.post("/payment/checkout", authorization, paymentCheckout)
userRouter.get("/payment-status/:session/:userID", authorization, paymentStatus)






module.exports = userRouter