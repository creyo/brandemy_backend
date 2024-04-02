let jwt = require("jsonwebtoken")
let secretKey = "osnilWebSolutionPvtLtd."


//generate token
const generateToken = (payload)=>{

    let token = jwt.sign(payload,secretKey,{ expiresIn: '10m' })
    return token 

}


module.exports = {generateToken}