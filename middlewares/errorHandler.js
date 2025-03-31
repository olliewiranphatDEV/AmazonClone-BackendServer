module.exports = (error, req, res, next) => {
    console.log('error', error);
    res.status(error.statusCode || 500).json({ status: "FAIL:(", ERROR: error.message || "Something wrong!" })
}