const db = require("../models");

const Account = db.accounts;
const Transaction = db.transactions;

exports.getAccountInfo = async (req, res) => {
  const { accountNum } = req.body;
  if (!accountNum) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const transaction = await db.sequelize.transaction();

    // Check if sender has enough balance
    const accountData = await Account.findOne(
      { where: { accountNum: accountNum } },
      { transaction }
    );

    await transaction.commit();
    return res.status(201).json({ accountData });
  } catch (err) {
    console.error("Error sending money:", err);
    return res.status(500).json({ message: "Error inquiry" });
  }
};

exports.getHistoricalTransactions = async (req, res) => {
  const { accountNum } = req.body;
  if (!accountNum) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const transaction = await db.sequelize.transaction();
    let whereClause = {
      [db.Sequelize.Op.or]: [
        { fromAccountNum: accountNum },
        { toAccountNum: accountNum },
      ],
    };
    // Check if sender has enough balance
    const accountHistoricalData = await Transaction.findAll(
      { where: whereClause },
      { transaction }
    );
    await transaction.commit();
    return res.status(201).json({ accountHistoricalData });
  } catch (err) {
    console.error("Error inquiry data:", err);
    return res.status(500).json({ message: "Error inquiry" });
  }
};
