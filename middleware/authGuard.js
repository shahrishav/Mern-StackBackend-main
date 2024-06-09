const jwt =require ('jsonwebtoken')
const authGuard = (req ,res ,next ) =>{

    // check incoming data
    console.log(req.headers) //pass
    // get authorization data from headers
    const authHeader = req.headers.authorization;
    // check or validate 
    if(!authHeader){
        res.status(400).json({
            success : false,
            message : "Auth Header not found!'"
        })
    }
    // Split the data (Format: 'Bearer token-ssdfg') -only token 
    const token =authHeader.split(' ')[1]
    // if token not found :stop the process (res)
    if(!token || token ===''){
        res.status(400).json({
            success : false,
            message : "Token not found!'"
        })
    }
    // if token found then verify
    try {
        const decodeUserData =jwt.verify(token,process.env.JWT_SECRET)
        req.user =decodeUserData;
        next()

    } catch (error){
        res.status(400).json({
            success : false,
            message : "Not Authenticated!"
        })
    }
    // if verified : next (function in controller )
    // not verified : not auth 
}

module.exports ={
    authGuard
}