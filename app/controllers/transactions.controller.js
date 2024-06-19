const db = require("../models");

const Transaction = db.transactions;
const Account = db.accounts;

exports.sendBalance = async (req, res) => {
  const { fromAccountNum, toAccountNum, amount, fees } = req.body;

  if (!fromAccountNum || !toAccountNum || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const transaction = await db.sequelize.transaction();

    // Check if sender has enough balance
    const senderAccount = await Account.findOne(
      { where: { accountNum: fromAccountNum } },
      { transaction }
    );

    const recipientAccount = await Account.findOne(
      { where: { accountNum: toAccountNum } },
      { transaction }
    );

    // 2. Check if both accounts exist
    if (!senderAccount || !recipientAccount) {
      await transaction.rollback();
      return res.status(404).json({ message: "Account not found" });
    }

    // 3. Check if sender has sufficient balance
    const totalAmount = amount + fees;
    if (senderAccount.balance < totalAmount) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // 4. Deduct amount from sender's balance
    await senderAccount.decrement("balance", { by: totalAmount, transaction });

    // 5. Add amount to receiver's balance
    await recipientAccount.increment("balance", { by: amount, transaction }); // Wrap in a try-catch for error handling

    // 6. Create a new transaction record
    const newTransaction = await Transaction.create(
      {
        fromAccountNum,
        toAccountNum,
        amount,
        fees,
        timestamp: new Date(),
      },
      { transaction }
    );

    await transaction.commit();
    return res.status(201).json({ transaction: newTransaction });
  } catch (error) {
    // Rollback the transaction on any error
    const transaction = await db.sequelize.transaction();
    await transaction.rollback();
    console.error("Error sending money:", error);
    return res.status(500).json({ message: "Error processing transaction" });
  }
};
