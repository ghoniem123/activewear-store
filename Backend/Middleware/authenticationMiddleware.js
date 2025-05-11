// const jwt = require("jsonwebtoken");
// require('dotenv').config();
// const secretKey =process.env.SECRET_KEY ;

// module.exports = function authenticationMiddleware(req, res, next) {
//   const path = req.path;


//   if (path === "/api/products"||path === "/api/products/") {
//     return next();
//   }

//   const cookie = req.cookies;

//   if (!cookie) {
//     return res.status(401).json({ message: "No Cookie provided" });
//   }

//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(405).json({ message: "No token provided" });
//   }

//   jwt.verify(token, secretKey, (error, decoded) => {
//     if (error) {
//       return res.status(403).json({ message: "Invalid token" });
//     }
        
//     req.User = decoded.User;
//     next();
//   });
// };

