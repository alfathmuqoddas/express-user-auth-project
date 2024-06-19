module.exports = (sequelize, Sequelize) => {
  const Accounts = sequelize.define(
    "banking_mockup_accounts",
    {
      accountId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "banking_users",
        //   key: "userId",
        // },
      },
      accountNum: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    },
    {
      tableName: "accounts",
      timestamps: true,
    }
  );

  return Accounts;
};
