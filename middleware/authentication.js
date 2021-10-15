const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.auhtorization.split(" ")[1];
        console.log(token);
        const varify = jwt.verify(token,'this is dummy text');
        console.log(varify);
        next();
    }
    catch(error){
        return res.send('invalid token')
    }
}