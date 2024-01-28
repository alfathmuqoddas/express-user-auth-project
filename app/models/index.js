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

db.role.belongsToMany(db.user, {
  through: "user_roles",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
