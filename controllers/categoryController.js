const { response } = require('express');
const prisma = require('../models');
const createError = require('../utils/createError');
const TryCatch = require("../utils/TryCatch");

exports.addCategory = TryCatch(async (req, res) => {
    console.log('req.body', req.body);
    const { name } = req.body
    const dupCate = await prisma.category.findFirst({
        where: { name }
    })
    dupCate && createError(400, "This category alredy exits")

    const newCategory = await prisma.category.create({
        data: { ...req.body }
    })

    res.status(200).json({ status: "SUCCESS", message: "Add Category already", results: newCategory })
})

exports.getAllCategories = TryCatch(async (req, res) => {
    const allCategories = await prisma.category.findMany()
    console.log('allCategories >>>', allCategories);
    res.status(200).json({ message: "SUCCESS Get All Categories", results: allCategories })
})

exports.updateCategory = TryCatch(async (req, res) => {
    console.log('req.body', req.body);
    // const result = await prisma.category.update({
    //     where: { categoryID: parseInt(req.params.categoryID) },
    //     data: req.body
    // })
    res.status(200).json({ status: "SUCCESS", message: "Update Category already" })
})

exports.deleteCategory = TryCatch(async (req, res) => {
    console.log('req.params', req.params);
    const results = await prisma.category.delete({ where: { categoryID: Number(req.params.categoryID) } })
    res.status(200).json({ status: "SUCCESS", message: "Delete Category already", results })
})
