import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    console.log("aaa", process.env.TOKEN_SECRET);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("user is not authorized");
      }
      console.log(decoded);
      req.user = decoded.user;
      next();
    });

    if (!token) {
      res.status(401);
      throw new Error("user is not authorized");
    }
  } else {
    res.status(401);
    throw new Error("user is not authorized");
  }
};
