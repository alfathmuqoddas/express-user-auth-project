var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const db = require("../models");
const config = require("../config/auth.config");

const User = db.user;
const Account = db.accounts;
const Transaction = db.transactions;

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.create({
      username: username.toLowerCase(),
      email: email,
      password: bcrypt.hashSync(password, 8),
    });

    let accountNumber;
    do {
      accountNumber =
        Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    } while (await Account.findOne({ where: { accountNum: accountNumber } }));

    const account = await Account.create({
      userId: user.userId,
      accountNum: accountNumber,
      balance: 500000000.0,
      updatedAt: new Date(),
    });

    const transaction = await Transaction.create({
      fromAccountNum: 1,
      toAccountNum: account.accountNum,
      amount: 500000000.0,
      fees: 0,
      timestamp: new Date(),
    });

    if (user.setRoles) {
      await user.setRoles([1]); // Assuming role ID 1
    }

    res.status(201).send({
      message: "User and Account created successfully!",
      user: { username: user.username, email: user.email },
      account: {
        accountNum: account.accountNum,
        balance: account.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error creating user and account" });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(`ROLE_${roles[i].name.toUpperCase()}`);
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
