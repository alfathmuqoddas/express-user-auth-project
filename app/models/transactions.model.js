module.exports = (sequelize, Sequelize) => {
  const Transactions = sequelize.define(
    "banking_mockup_transactions",
    {
      transactionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fromAccountNum: {
        type: Sequelize.BIGINT,
        allowNull: false,
        // references: {
        //   model: "accounts",
        //   key: "accountNum",
        // },
      },
      toAccountNum: {
        type: Sequelize.BIGINT,
        allowNull: false,
        // references: {
        //   model: "accounts",
        //   key: "accountNum",
        // },
      },
      amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      fees: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "transactions",
      timestamps: false,
    }
  );

  return Transactions;
};
