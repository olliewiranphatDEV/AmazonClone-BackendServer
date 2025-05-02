const prisma = require('../models')
const createError = require('../utils/createError')
const TryCatch = require('../utils/TryCatch')
const jwt = require('jsonwebtoken') //DONT USE!!!
// require('dotenv').config()
const { clerkClient } = require('@clerk/express')
const stripe = require('stripe')('sk_test_51QzCa7GzgqobIesyAn2N0Om4Zyeiynd6tC2cmVSBJ8yEwypY5FVvsYMMIWXNAw2oWMD2f2CxFUFFuHXqY0N1pmBl00BIGFWtbW');

/// Check isEamil or isPhonenumber?? : for using find user @Uniqe in data
const checkEmailorPhone = (identity) => {
    let identityKEY = ""
    if (/^[0-9]{10,15}$/.test(identity)) {
        identityKEY = 'phoneNumber'
    }
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identity)) {
        identityKEY = 'email'
    }
    if (!identityKEY) {
        createError(400, 'only email or phone number')
    }
    return identityKEY
}
///// API Register create new User
exports.userRegister = async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        for (const key in req.body) {
            // console.log(key);
            if (!req.body[key]) {
                createError(400, "Please fill all data")
            }
        }

        const identityKEY = checkEmailorPhone(req.body.identity) //email or phoneNumber
        ///// Check Duplicate User:
        const dupUser = await prisma.user.findUnique({
            where: { [identityKEY]: req.body.identity }
        })
        if (dupUser) {
            createError(400, `Already exist this ${identityKEY}`)
        }
        // console.log(identityKEY);
        const { identity, ...userInfo } = req.body
        // console.log('userInfo', userInfo);
        ///// Create new User:
        const newUser = await prisma.user.create({
            data: { [identityKEY]: identity, ...userInfo }
        })
        console.log(newUser);


        res.status(200).json({ status: "SUCCESS", message: "Register already", newUser })
    } catch (error) {
        next(error)
    }
}
////// API Login validate User in DB and Generate TOKEN
exports.userSignin = TryCatch(async (req, res) => {
    console.log('req.body', req.body);
    ///// Check User registered into DB?? :
    const identityKEY = checkEmailorPhone(req.body.identity)
    console.log('identityKEY', identityKEY);
    ///// Find in DB:
    const userData = await prisma.user.findUnique({
        where: { [identityKEY]: req.body.identity }
    })
    if (!userData) {
        createError(404, "Not found User, Please to Register!")
    }
    ///// findRegisterd OK : Generate Token sending to USER
    // console.log('findRegisterd', findRegisterd);
    // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);

    const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })

    res.status(200).json({ status: "SUCCESS", message: "Login already", token, userData })
})

//////////////// Use Clerk !!! /////////////
exports.userMyAccount = TryCatch(async (req, res) => {
    // console.log('req.user', req.user.emailAddresses[0].emailAddress);

    ///// Find User:
    let results = await prisma.user.findUnique({ where: { clerkID: req.user.id } })
    if (!results) {
        results = await prisma.user.create({
            data: {
                clerkID: req.user.id,
                role: req.user.publicMetadata?.role || "CUSTOMER",
                firstName: req.user.firstName || "",
                lastName: req.user.lastName || "",
                imageUrl: req.user.imageUrl || "",
                email: req.user.emailAddresses[0]?.emailAddress || "",
                phoneNumber: req.user.phoneNumbers[0]?.phoneNumber || ""
            }
        })
    }
    // console.log('results', results);

    res.status(200).json({ message: "SUCCESS, Get My Account already!", results })
})





///// API Update User data : /user/upadte-account
exports.userCreateUpdateDB = TryCatch(async (req, res) => {

    // console.log('req.body', req.body); //get new user data to update
    const { firstName, lastName, email, phoneNumber, birthDay, gender, role, imageUrl, address } = req.body
    console.log('role', role);

    // console.log(req.user);
    const { id } = req.user
    // console.log('req.user.id', id);
    ///// Add role in User data CLERK names Key  publicMetadata
    if (req.body.role) {
        await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: { role } // role: value of role from req.body
        })
    }

    const results = await prisma.user.upsert({
        where: { clerkID: id },
        create: {
            ///// Transform "Date" (req.body) to DateTime Object before using Prisma, Prisma receive only DateTime
            firstName, lastName, email, phoneNumber, birthday: new Date(birthDay), gender, role, clerkID: id, imageUrl, address
        },
        update: {
            firstName, lastName, email, phoneNumber, birthday: new Date(birthDay), gender, role, imageUrl, address
        }
    })
    // console.log('results', results);

    res.status(200).json({ status: "SUCCESS", message: "Updated already!", results })
})

exports.updateImageAccount = TryCatch(async (req, res) => {
    console.log('req.body', req.body);

    res.status(200).json({ message: "SUCCESS, Add Images at Cloudinary!" }) //send to Frontend
})

exports.deleteUser = TryCatch(async (req, res) => {
    console.log('req.user', req.user); //from authorization
    const { id } = req.user
    ///// Delete User Account at Clerk database :
    await clerkClient.users.deleteUser(id)

    const findUserDB = await prisma.user.findFirst({ where: { clerkID: id } })
    if (!findUserDB) {
        return res.status(200).json({ status: "SUCCESS", message: "No have user in DB, delete just Clerk" })
    } else {
        await prisma.user.delete({ where: { clerkID: id } })
    }


    ////// DELETE User at Clerk???
    res.status(200).json({ status: "SUCCESS", message: "Delete already!" })
})




///// API Access Cart USER after Login : JOIN User, ProductOnCart
exports.ADDtoCart = TryCatch(async (req, res) => {
    // console.log('req.body', req.body);
    const { cart } = req.body
    console.log('cart', cart);

    const totalPriceItem = cart.price * cart.selectedQuantity
    console.log('totalPriceItem', totalPriceItem);


    // เช็กว่า user มีอยู่ไหม
    const existingUser = await prisma.user.findUnique({
        where: { clerkID: req.user.id }
    })
    let newUser = null
    if (!existingUser) {
        newUser = await prisma.user.create({
            data: { clerkID: req.user.id }
        })
    }

    // เช็กว่า product มีอยู่ไหม
    const existingProduct = await prisma.product.findUnique({
        where: { productID: cart.productID }
    })
    if (!existingProduct) {
        return res.status(400).json({ message: 'Product does not exist!' });
    }

    const thisCart = await prisma.productOnCart.findFirst({
        where: {
            productID: cart.productID,
            cart: {
                customerID: req.user.id
            }
        }
    })
    console.log('thisCart', thisCart);

    if (thisCart) {
        await prisma.cart.delete({
            where: {
                cartID: thisCart.cartID
            }
        })
    }


    const results = await prisma.cart.create({
        data: {
            customerID: req.user.id || newUser.clerkID,
            totalPrice: totalPriceItem,
            ProductOnCart: {
                create: [
                    {
                        productID: cart.productID,
                        quantity: cart.selectedQuantity
                    }
                ]
            }
        }

    })
    console.log('results', results);

    res.status(200).json({ status: "SUCCESS", message: "ADD to Cart already!" }) //Send Cart data back
})


///// API Access Cart USER after Login : JOIN User, ProductOnCart
exports.userCart = TryCatch(async (req, res) => {

    const results = await prisma.cart.findMany({
        where: {
            customerID: req.user.id
        },
        include: {
            ProductOnCart: {
                include: {
                    product: {
                        include: {
                            ProductImage: true
                        }
                    }
                }
            }
        },
    });
    console.log('results', results);
    !results && createError(404, `No have Cart Data for this User`)

    res.status(200).json({ status: "SUCCESS", message: "Access Cart already!", results }) //Send Cart data back

})


exports.deleteAllCartItem = TryCatch(async (req, res) => {
    const findUserOnCart = await prisma.cart.findMany({
        where: {
            customerID: req.user.id
        }
    })
    console.log('findUserOnCart', findUserOnCart);

    if (!findUserOnCart || findUserOnCart.length === 0) {
        return createError(404, "Not found this user on cart")
    }

    //DELETE ALL CART ITEMS OF THIS USER
    await prisma.cart.deleteMany({
        where: {
            customerID: req.user.id
        }
    })

    res.status(200).json({ message: "SUCCESS!, Delete All userCart" })
})

exports.updateQuantity = TryCatch(async (req, res) => {
    const { cartID, productID, updatedQTY } = req.body
    console.log("Incoming update:", { cartID, productID, updatedQTY });

    // 1. อัปเดต quantity ในตาราง ProductOnCart
    await prisma.productOnCart.updateMany({
        where: {
            cartID: cartID,
            productID: productID
        },
        data: {
            quantity: parseInt(updatedQTY)
        }
    })

    // 2. ดึง product.price มาคำนวณราคารวมใหม่
    const product = await prisma.product.findUnique({
        where: { productID }
    })

    const updatedTotalPrice = parseFloat(product.price) * parseInt(updatedQTY)

    // 3. อัปเดต totalPrice ใน cart
    await prisma.cart.update({
        where: {
            cartID
        },
        data: {
            totalPrice: updatedTotalPrice
        }
    })

    res.status(200).json({ status: "SUCCESS", message: "Quantity updated!" })
})


exports.paymentCheckout = TryCatch(async (req, res) => {
    const { filteredCart, totalPriceCard } = req.body
    console.log('filteredCart', filteredCart);
    console.log('totalPriceCard', totalPriceCard);

    filteredCart.forEach(cart =>
        cart.ProductOnCart.forEach(item => {
            console.log("🧾 Product Name:", item.product?.productName)
            console.log("🧾 Price:", item.product?.price)
        })
    )

    const allProductOnOrder = filteredCart.flatMap(cartItem =>
        cartItem.ProductOnCart.map(productItem => ({
            productID: productItem.productID,
            quantity: productItem.quantity,
        }))
    )

    if (!filteredCart || allProductOnOrder.length === 0) {
        return res.status(400).json({ message: "No products selected for order" })
    }

    // 1. Create Order & ProductOnOrder
    const newOrder = await prisma.order.create({
        data: {
            customerID: req.user.id,
            totalPrice: parseFloat(totalPriceCard),
            ProductOnOrder: {
                createMany: {
                    data: allProductOnOrder
                }
            }
        }
    })
    console.log('newOrder', newOrder);


    const line_items = filteredCart.flatMap(cartItem =>
        cartItem.ProductOnCart.map(productItem => ({
            quantity: productItem.quantity,
            price_data: {
                currency: "thb",
                product_data: {
                    name: productItem.product.productName
                },
                unit_amount: Math.round(parseFloat(productItem.product.price) * 100)
            }
        }))
    )
    console.log(
        "✅ line_items to Stripe:",
        JSON.stringify(line_items, null, 2)
    )


    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        metadata: { orderID: newOrder.orderID },
        line_items,
        mode: 'payment',
        return_url: `http://localhost:5173/user/payment/complete/{CHECKOUT_SESSION_ID}`
    })


    //3. ส่ง client_secret กลับให้ฝั่ง frontend ใช้
    res.send({ clientSecret: session.client_secret })
})


//// JUST UPDATE STATUS inBD: when payment complete
exports.paymentStatus = TryCatch(async (req, res) => {
    const { session, userID } = req.params
    // console.log('userID >>>', userID);

    // console.log('session >>>', session);

    const sessionCheckout = await stripe.checkout.sessions.retrieve(session)
    console.log('sessionCheckout >>>', sessionCheckout);

    ///// Validate: 
    if (sessionCheckout.status !== "complete") {
        return createError(400, "Somethimg Error")
    }

    ///// PaymentCompleted : Update Status "PAID"
    const result = await prisma.order.update({
        where: { orderID: parseInt(sessionCheckout.metadata.orderID) },
        data: { paymentStatus: "PAID" }
    })
    console.log('result', result);


    await prisma.order.deleteMany({
        where: {
            customerID: Number(userID),
            paymentStatus: "UNPAID"
        }
    });

    res.status(200).json({ status: "SUCCESS", message: "paymentStatus", result })

})





