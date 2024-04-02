const jwt = require('jsonwebtoken');
const secretKey = "osnilWebSolutionPvtLtd.";



const authentication = async (req, res, next) => {
    try {
         
        const authHeader = req.headers.authorization;
        
       
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: false, msg: "Token must be provided" });
        }
        const token = authHeader.split(" ")[1];
        
        jwt.verify(token,"osnilWebSolution", (err, decoded) => {
            if (err) {
               return res.status(401).json({ status: false, message: "JWT verification failed", error: err.message });
            }
            console.log(decoded)
            req.decoded = decoded;
            
            next();
        });
    } catch (err) {
        
        return res.status(500).json({ status: false, message: "Internal Server Error", error: err.message });
    }
};





module.exports = {authentication}
