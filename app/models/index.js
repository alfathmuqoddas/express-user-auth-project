const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const { DB, USER, PASSWORD, HOST, dialect, pool, dialectOptions } = config;

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect,
  pool,
  dialectOptions: { ssl: dialectOptions.ssl },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.accounts = require("../models/accounts.model.js")(sequelize, Sequelize);
db.transactions = require("../models/transactions.model.js")(
  sequelize,
  Sequelize
);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.ROLES = ["user", "admin", "moderator"];

// db.accounts.hasMany(db.transactions, { as: "Transactions" }); // All transactions for an account
// db.transactions.belongsTo(db.accounts, {
//   as: "SourceAccount",
//   foreignKey: "fromAccountNum",
// });
// db.transactions.belongsTo(db.accounts, {
//   as: "DestinationAccount",
//   foreignKey: "toAccountNum",
// });

db.user.hasOne(db.accounts, { foreignKey: "userId", as: "account" });
db.accounts.belongsTo(db.user, { foreignKey: "userId", as: "user" });

module.exports = db;
