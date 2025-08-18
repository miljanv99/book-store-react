const VALIDATOR = require("validator");
const PASSPORT = require("passport");
const USER = require("mongoose").model("User");
const RECEIPT = require("mongoose").model("Receipt");

function validateRegisterForm(payload) {
  let errors = {};
  let isFormValid = true;

  if (
    !payload ||
    typeof payload.email !== "string" ||
    !VALIDATOR.isEmail(payload.email)
  ) {
    isFormValid = false;
    errors.email = "Please provide a correct email address.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < 3
  ) {
    isFormValid = false;
    errors.password = "Password must have at least 3 characters.";
  }

  if (!payload || payload.password !== payload.confirmPassword) {
    isFormValid = false;
    errors.passwordsDontMatch = "Passwords do not match!";
  }

  if (
    !payload ||
    typeof payload.username !== "string" ||
    payload.username.trim().length === 0
  ) {
    isFormValid = false;
    errors.name = "Please provide your name.";
  }

  if (payload.avatar.trim().length !== 0) {
    if (!VALIDATOR.isURL(payload.avatar)) {
      isFormValid = false;
      errors.avatar =
        "Please provide a valid link to your avatar image or leave the field empty.";
    }
  } else {
    if (payload.hasOwnProperty("avatar")) {
      delete payload["avatar"];
    }
  }

  return {
    success: isFormValid,
    errors,
  };
}

function validateLoginForm(payload) {
  let errors = {};
  let isFormValid = true;

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length === 0
  ) {
    isFormValid = false;
    errors.password = "Please provide your password.";
  }

  if (
    !payload ||
    typeof payload.username !== "string" ||
    payload.username.trim().length === 0
  ) {
    isFormValid = false;
    errors.name = "Please provide your name.";
  }

  return {
    success: isFormValid,
    errors,
  };
}

function validateAvatarForm(payload) {
  let errors = {};
  let isFormValid = true;

  if (!payload || !VALIDATOR.isURL(payload.avatar)) {
    isFormValid = false;
    errors.avatar = "Please provide a valid link to your avatar image.";
  }

  return {
    success: isFormValid,
    errors,
  };
}

module.exports = {
  register: (req, res) => {
    let validationResult = validateRegisterForm(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Register form validation failed!",
        errors: validationResult.errors,
      });
    }

    PASSPORT.authenticate("local-register", (err, token) => {
      if (err || !token) {
        return res.status(400).json({
          message: "Registration failed!",
          errors: { taken: "Username or email already taken" },
        });
      }

      return res.status(200).json({
        message: "Registration successful!",
        data: token,
      });
    })(req, res);
  },

  login: (req, res) => {
    let validationResult = validateLoginForm(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Login form validation failed!",
        errors: validationResult.errors,
      });
    }

    PASSPORT.authenticate("local-login", (err, token) => {
      if (err || !token) {
        return res.status(400).json({
          message: "Invalid Credentials!",
        });
      }

      return res.status(200).json({
        message: "Login successful!",
        data: token,
      });
    })(req, res);
  },

  getProfile: (req, res) => {
    let username = req.params.username;

    USER.findOne({ username: username })
      .populate("favoriteBooks")
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            message: `User ${username} not found in our database`,
          });
        }

        let userToSend = {
          _id: user.id,
          isAdmin: user.isAdmin,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          commentsCount: user.commentsCount,
          favoriteBooks: user.favoriteBooks,
          isCommentsBlocked: user.isCommentsBlocked
        };

        return res.status(200).json({
          message: "",
          data: userToSend,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "Something went wrong, please try again.",
        });
      });
  },

  getPurchaseHistory: (req, res) => {
    let userId = req.user.id;
    RECEIPT.find({ user: userId })
      .sort({ creationDate: -1 })
      .then((receipts) => {
        res.status(200).json({
          message: "",
          data: receipts,
        });
      });
  },

  editProfile: (req, res) => {
    let requesterId = req.user.id;
    let userToChange = req.body.id;
    let username = req.body.username;
    let email = req.body.email;
    let avatar = req.body.avatar;

    const update = {};

    if (requesterId !== userToChange) {
      return res.status(401).json({
        message: "You're not allowed to change other user data!"
      });
    }

    if (!username && !email) {
      return res.status(400).json({
        message: 'You have not entered username and email!'
      });
    }

    if (username) {
      update.username = username;
    }
    if (email) {
      update.email = email;
    }
    if (avatar) {
      update.avatar = avatar;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        message: 'No fields updated!'
      });
    }

    USER.findByIdAndUpdate(userToChange, update, {
      new: true,
      runValidators: true
    })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found.' });
        }

        const changedFields = {};
        for (const key in update) {
          changedFields[key] = update[key];
        }

        return res.json({ message: 'User updated', data: changedFields });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  },
  

  userBlockStatus: (req, res) => {
    let usernameReq = req.body.username

    USER.findOne({username: usernameReq}).then((user)=>{
      if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
      }
      return res.status(200).json({
        data: user.isCommentsBlocked
      })
    })
  },

  commentsPermission: (req, res) => {
    let userToBlock = req.body.username

         USER.findOneAndUpdate(
          {username: userToBlock, isAdmin: false}, 
          [{$set: {isCommentsBlocked: {$not: '$isCommentsBlocked'}}}],
          {new: true},
        ).then((updatedUser)=>{
          if (!updatedUser) {
            return res.status(404).json({
              message: 'User not found'
            })
          }

          return res.status(200).json({
            message: `Comments are ${updatedUser.isCommentsBlocked ? 'blocked' : 'unblocked'} for this user: ${updatedUser.username}`
          });

        })  
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "Something went wrong, please try again.",
        });
      });
  },

  unblockComments: (req, res) => {
    let adminId = req.params.userId; // Assuming you have a way to identify the admin

    USER.findById(adminId)
      .then((admin) => {
        if (!admin || !admin.isAdmin) {
          return res.status(403).json({
            message: "You are not authorized to perform this action",
          });
        }

        USER.find({ isAdmin: false }, "_id", (err, users) => {
          if (err) {
            return res.status(400).json({
              message: "Error fetching user IDs from database",
            });
          }

          const userIDs = users.map((user) => user._id);

          USER.updateMany(
            { _id: { $in: userIDs }, isAdmin: false }, // Only non-admin users
            { $set: { isCommentsBlocked: false } }, // Set isCommentsBlocked to true
          )
            .then((result) => {
              if (result.nModified === 0) {
                return res.status(400).json({
                  message: "You have already block the comments for all users",
                });
              }

              res.status(200).json({
                message: "Comments are un-blocked for all users",
              });
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).json({
                message: "Something went wrong, please try again.",
              });
            });
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "Something went wrong, please try again.",
        });
      });
  },
};
