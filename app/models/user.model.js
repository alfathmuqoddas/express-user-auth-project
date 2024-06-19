module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "banking_mockup_users",
    {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "banking_users",
      timestamps: true,
    }
  );

  return User;
};
