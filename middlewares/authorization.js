const createError = require("../utils/createError");
const TryCatch = require("../utils/TryCatch");
// const jwt = require('jsonwebtoken')
const { clerkClient } = require('@clerk/express')

//Login??? : if Logined, will get Token from CLERK
module.exports = TryCatch(async (req, res, next) => {
    // console.log('req.auth >>>', req.auth);
    // ///// Check Login??? : if Logined, will have userId at req.auth of Clerk from ClerkToken
    const clerkID = req.auth.userId //== Token (req.body), want userdata from CLERK
    // console.log('clerkID >>>', clerkID);
    ///// Autorize :
    if (!clerkID) { //!== Logined
        return createError(401, "Unauthorized!")
    }
    ///// Have userId (== clerkID)
    const userClerk = await clerkClient.users.getUser(clerkID) //get User data from Clerk
    // console.log('Userdata#Clerk >>>>>', userClerk);

    req.user = userClerk //assign in req.user
    // console.log('req.user >>>>>', req.user);


    next() //next to do Controller/next MW
})


// module.exports = TryCatch(async (req, res, next) => {
//     ///// Check sent Token?? : req.headers.authorization
//     const authorization = req.headers.authorization
//     // console.log(authorization); //Bearer Token
//     if (!authorization || !authorization.startsWith('Bearer')) {
//         createError(400, "Unthorized!")
//     }

//     ///// Verify Token: + get userData
//     const token = authorization.split(' ')[1]
//     // console.log('token', token);
//     !token && createError(400, "No have token")
//     const payload = jwt.verify(token, process.env.JWT_SECRET)
//     // console.log('payload', payload);
//     const { iat, exp, ...userData } = payload

//     ///// Assign userData into req.user : for userAccount Controllers use it
//     req.user = userData // userData came from Payload in Token, got it by verify


//     next() //do next MD or next to Controllers for res.
// })