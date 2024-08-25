const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {

    try{
        const token = req.headers['authtoken']
        if(!token){
            res.status(500).json({
                message: "Invalid token"
            })
        }

        const decoded = await jwt.verify(token,"jojo")
        req.user = decoded.id
        next();
    }catch(error){
        res.status(500).json({
            message: error
        })
    }

}