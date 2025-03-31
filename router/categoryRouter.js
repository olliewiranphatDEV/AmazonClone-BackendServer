

const express = require('express')
const { addCategory, getAllCategories } = require('../controllers/categoryController')
const authorization = require('../middlewares/authorization')
const categoryRouter = express.Router()

categoryRouter.get('/all-categories', getAllCategories)
categoryRouter.post('/add-category', authorization, addCategory)



module.exports = categoryRouter