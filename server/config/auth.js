const JWT = require("jsonwebtoken");
const ROLE = require("mongoose").model("Role");
require("dotenv").config();

function verifyToken(req) {
  const TOKEN = req.headers.authorization.split(" ")[1];

  return new Promise((resolve, reject) => {
    JWT.verify(TOKEN, process.env.BACKEND_SECRET, (err, decoded) => {
      if (err) {
        reject();
      }

      req.user = decoded.sub;
      console.log('TEST:', req.user);
      resolve();
    });
  });
}

module.exports = {
  isAuth: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "You need to be logged in to access this!",
      });
    }

    verifyToken(req)
      .then(() => {
        next();
      })
      .catch(() => {
        return res.status(401).json({
          message: "Token verification failed!",
        });
      });
  },

  isInRole: (role) => {
    return (req, res, next) => {
      if (req.headers.authorization) {
        ROLE.findOne({ name: role }).then((role) => {
          verifyToken(req)
            .then(() => {
              let isInRole = req.user.roles.indexOf(role.id) !== -1;

              if (isInRole) {
                next();
              } else {
                return res.status(401).json({
                  message: "You need to be an admin to access this!",
                });
              }
            })
            .catch(() => {
              return res.status(401).json({
                message: "Token verification failed!",
              });
            });
        });
      } else {
        return res.status(401).json({
          message: "You need to be logged in to access this!",
        });
      }
    };
  },
};
