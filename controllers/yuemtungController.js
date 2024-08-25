const User = require('../model/userModel');
const { Balance } = require('../model/balanceModel');
const { Transaction } = require('../model/transactionModel');
const sequelize = require('../config/db');

exports.borrow = async (req, res) => {
    const { money, lender } = req.body;
    const borrower = req.user;

    if (!money || money <= 0 || !lender) {
        return res.status(400).json({
            message: "Invalid input: Ensure money is greater than 0 and both borrower and lender are specified"
        });
    }

    if (borrower === lender) {
        return res.status(400).json({
            message: "Borrower and lender cannot be the same"
        });
    }

    const t = await sequelize.transaction();
    
    try {
        const [borrowerUser, lenderUser] = await Promise.all([
            User.findOne({ where: { id: borrower } }),
            User.findOne({ where: { id: lender } })
        ]);

        if (!borrowerUser || !lenderUser) {
            return res.status(404).json({
                message: "Borrower or lender not found"
            });
        }

        // Update the balance for the borrower
        const [affectedRows] = await Balance.update(
            { balance: sequelize.literal(`balance - ${money}`) },
            { where: { id: borrower }, transaction: t }
        );

        if (affectedRows === 0) {
            throw new Error("Failed to update balance");
        }

        // Create a new transaction record
        const transactionRecord = await Transaction.create(
            {
                borrower_id: borrower,
                lender_id: lender,
                amount: money,
                transaction_type: "borrow"
            },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({
            message: "Borrowing successful",
            transaction: transactionRecord
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: 'Error processing borrow: ' + error.message
        });
    }
};


exports.repay = async (req, res) => {
    const { money, lender } = req.body;
    const borrower = req.user;

    if (!money || money <= 0 || !lender) {
        return res.status(400).json({
            message: "Invalid input: Ensure money is greater than 0 and both borrower and lender are specified"
        });
    }

    if (borrower === lender) {
        return res.status(400).json({
            message: "Borrower and lender cannot be the same"
        });
    }

    const t = await sequelize.transaction();
    
    try {
        const [borrowerUser, lenderUser] = await Promise.all([
            User.findOne({ where: { id: borrower } }),
            User.findOne({ where: { id: lender } })
        ]);

        if (!borrowerUser || !lenderUser) {
            return res.status(404).json({
                message: "Borrower or lender not found"
            });
        }

        const currentDebt = await sequelize.query(`
            SELECT
                (SUM(CASE WHEN transaction_type = 'borrow' THEN amount ELSE 0 END) -
                SUM(CASE WHEN transaction_type = 'repay' THEN amount ELSE 0 END)) AS currentDebt
            FROM transactions
            WHERE lender_id = :lender AND borrower_id = :borrow
            GROUP BY lender_id`,
            {
                replacements: {lender: lender, borrow: borrower},
                type: sequelize.QueryTypes.SELECT
            },
            
        )

        if(currentDebt[0].currentDebt <= 0){
            return res.status(400).json({
                message: "invalid repayment"
            });
        }

        await Balance.update(
            { balance: sequelize.literal(`balance + ${money}`) },
            { where: { id: borrower }, transaction: t }
        );


        const transactionRecord = await Transaction.create(
            {
                borrower_id: borrower,
                lender_id: lender,
                amount: money,
                transaction_type: "repay"
            },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({
            message: "Repayment successful",
            transaction: transactionRecord,
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: 'Error processing repayment: ' + error.message
        });
    }
};
