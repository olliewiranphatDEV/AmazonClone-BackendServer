const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const NotFound = require('./middlewares/NotFound')
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')
const morgan = require('morgan')

const userRouter = require('./router/userRouter')
const sellerRouter = require('./router/sellerRouter')
const adminRouter = require('./router/adminRouter')
const categoryRouter = require('./router/categoryRouter')
const { clerkMiddleware } = require('@clerk/express')
const fs = require('fs')

if (process.env.CA_PEM_B64) {
    fs.writeFileSync(
        './tmp/ca.pem',
        Buffer.from(process.env.CA_PEM_B64, 'base64').toString('utf-8')
    )
}


app.get("/", (req, res) => {
    res.send("API is working! 🎉");
});



///// Middlewares :
app.use(clerkMiddleware()) //req.auth
///// Connect Frontend - Backend :
///// Connect Frontend - Backend :
app.use(cors({
    origin: 'https://amazon-clone-frontend-web.vercel.app',
    credentials: true
}))

///// Read JSON req.body from Frontend :
app.use(express.json({ limit: "10mb" })) //Max Payload size Server can receive
app.use(morgan('dev'))

///// Router : 
app.use('/user', userRouter)

app.use('/seller-center', sellerRouter)

app.use('/admin', adminRouter)

app.use('/category', categoryRouter)


///// Not Found Path :
app.use(NotFound)

///// error from path and router
app.use(errorHandler)

app.listen(port, () => console.log(`Server is running on PORT ${port}`))