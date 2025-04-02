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
    const { id } = req.user
    console.log('id', id);
    ///// Find User:
    const results = await prisma.user.findFirst({ where: { clerkID: id } })
    !results && createError(404, "Nu have this USER")
    res.status(200).json({ status: "SUCCESS", message: "Get My Account already!", results })
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
    await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: { role } // role: value of role from req.body
    })

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
    const { userID } = req.params
    console.log('userID', userID);
    // console.log('req.body', req.body);
    const { cart } = req.body
    console.log('cart', cart);

    const thisCart = await prisma.cart.findFirst({
        where: { customerID: parseInt(userID) }
    })
    console.log('thisCart', thisCart);
    if (thisCart) {
        await prisma.productOnCart.deleteMany({
            where: { cartID: thisCart.cartID }
        })
        await prisma.cart.deleteMany({
            where: { customerID: parseInt(userID) }
        })
    }

    const totalPriceItem = cart.map(el => {
        return el.price * el.quantity
    })
    console.log('totalPriceItem', totalPriceItem);
    const totalPriceUserID = totalPriceItem.reduce((acc, crr) => acc + crr, 0)
    console.log('totalPriceUserID', totalPriceUserID);

    // เช็กว่า user มีอยู่ไหม
    const existingUser = await prisma.user.findUnique({
        where: { userID: parseInt(userID) }
    })
    if (!existingUser) {
        const newUser = await prisma.user.create({
            data: { clerkID: req.user.id }
        })
    }

    // เช็กว่า product มีอยู่ไหม
    const existingProduct = await prisma.product.findUnique({
        where: { productID: cart[0].productID }
    })
    if (!existingProduct) {
        return res.status(400).json({ message: 'Product does not exist!' });
    }


    const results = await prisma.cart.create({
        data: {
            customerID: parseInt(userID) || newUser.userID,
            totalPrice: totalPriceUserID,
            ProductOnCart: {
                create: cart.map(item => ({
                    productID: parseInt(item.productID),
                    quantity: parseInt(item.quantity)
                }))
            }
        }

    })
    console.log('results', results);

    res.status(200).json({ status: "SUCCESS", message: "ADD to Cart already!" }) //Send Cart data back
})


///// API Access Cart USER after Login : JOIN User, ProductOnCart
exports.userCart = TryCatch(async (req, res) => {
    const { userID } = req.params
    console.log('userID >>', userID); //8
    const results = await prisma.cart.findFirst({
        where: { customerID: parseInt(userID) },
        include: {
            ProductOnCart: {
                include: {
                    product: {
                        include: {
                            productImage: true
                        }
                    }
                }
            }
        },
    });
    console.log('results', results);
    !results && createError(404, `No have Cart Data for this User ${userID}`)

    res.status(200).json({ status: "SUCCESS", message: "Access Cart already!", results }) //Send Cart data back

})

exports.updateQuantity = TryCatch(async (req, res) => {
    const { userID } = req.params
    console.log('userID', userID);
    console.log(req.body);
    const { cartID, productID, quantity } = req.body
    await prisma.productOnCart.updateMany({
        where: { cartID: parseInt(cartID), productID: parseInt(productID) },
        data: { quantity: parseInt(quantity) } //Upadate Quantity of this product on cart  
    })

    /////Get userCart: 
    const results = await prisma.cart.findFirst({
        where: { customerID: parseInt(userID) },
        include: {
            ProductOnCart: {
                include: {
                    product: {
                        include: {
                            productImage: true
                        }
                    }
                }
            }
        },
    });
    console.log('results', results);

    const totalPriceItem = results.ProductOnCart.map(el => {
        // console.log('el', el);

        return el.product.price * el.quantity
    })
    // console.log('totalPriceItem', totalPriceItem);
    const totalPriceUserID = totalPriceItem.reduce((acc, crr) => acc + crr, 0)
    console.log('totalPriceUserID', totalPriceUserID);
    const updateTotalPriceCartID = await prisma.cart.update({
        where: { cartID: parseInt(cartID) },
        data: { totalPrice: totalPriceUserID }
    })
    console.log('updateTotalPriceCartID', updateTotalPriceCartID);

    res.status(200).json({ status: "SUCCESS", message: "Access Cart already!" }) //Send Cart data back

})

exports.paymentCheckout = TryCatch(async (req, res) => {
    // console.log('req.body >>>', req.body);
    const { userCart } = req.body
    console.log('userCart', userCart);

    ///// Create ORDER in DB: before Create session to checkout form 
    const order = await prisma.order.create({
        data: {
            ProductOnOrder: {
                create: userCart.ProductOnCart.map(item => ({
                    productID: item.productID,
                    quantity: item.quantity
                }))
            },
            customerID: userCart.customerID,
            totalPrice: userCart.totalPrice
        }
    })
    console.log('order', order);

    ///// Create Checkout Session and use session.id to open Checkout form, if success, link to PaymentComplete.jsx
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        metadata: { orderID: order.orderID },
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                quantity: 1,
                price_data: {
                    currency: "thb",
                    product_data: {
                        name: "HELLO"
                    },
                    unit_amount: order.totalPrice * 100
                }
            },
        ],
        mode: 'payment',
        return_url: `http://localhost:5173/user/payment/complete/{CHECKOUT_SESSION_ID}`,//if success, link to PaymentComplete.jsx
    });

    res.send({ clientSecret: session.client_secret });
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





