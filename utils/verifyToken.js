import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

//login karne par cookie create hogi, if cookie delete karde toh you are not authenticated dega, login karke vapis ho jayegi cookie create
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated"));
  }

  // verify hone ke baad ya toh error if token is not valid for that cookie dega ya fir user de dega, dono variable hai

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));

    //this can be anything like req.hello etc
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    //req.users.id -> jwt token ke andar hai that was created in login, req.params.id, http url mein hi pass ho raha
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorised to delete"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorised to delete"));
    }
  });
};
