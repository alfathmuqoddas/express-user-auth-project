const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const usernameExists = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (usernameExists) {
      return res.status(400).send({
        message: "Failed! Username is already in use!",
      });
    }

    const emailExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailExists) {
      return res.status(400).send({
        message: "Failed! Email is already in use",
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkDuplicateUsernameOrEmail:", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
