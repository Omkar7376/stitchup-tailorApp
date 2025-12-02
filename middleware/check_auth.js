const jwt = require("jsonwebtoken")
const checkAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.SECRET)
        req.userData = decodedToken
        next()
    } catch(e){
        return res.status(401).json({
            'message' : 'Auth not found',
            'error' : e
        })
    }
}

module.exports = {
    checkAuth   
}