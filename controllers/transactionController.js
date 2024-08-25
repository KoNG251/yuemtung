
const { Transaction } = require('../model/transactionModel');
const sequelize = require('../config/db');

exports.transaction = async (req,res) => {
    try{

        const currentDebt = await sequelize.query(`
            SELECT
                users.name AS name,
                SUM(CASE WHEN transaction_type = 'borrow' THEN amount ELSE 0 END) AS currentBorrow,
                SUM(CASE WHEN transaction_type = 'repay' THEN amount ELSE 0 END) AS currentRepay,
                (SUM(CASE WHEN transaction_type = 'borrow' THEN amount ELSE 0 END) -
                SUM(CASE WHEN transaction_type = 'repay' THEN amount ELSE 0 END)) AS currentDebt
            FROM transactions
            JOIN users ON users.id = lender_id
            WHERE borrower_id = :borrow
            GROUP BY lender_id, users.name    
        `,
        {
            replacements: { borrow: req.user },
            type: sequelize.QueryTypes.SELECT
        });
        

    res.status(200).json({
            message: currentDebt
    });

    }catch(error){
        res.status(500).json({
            message: "Sever error: " + error
        });
    }
}

exports.allTransaction = async (req,res) => {
    try{

        const allTransaction = await sequelize.query(`
            SELECT
                users.name,transactions.*
            FROM transactions
            JOIN users ON users.id = lender_id
            WHERE borrower_id IN (:id)
        `,{
            replacements: { id: req.user },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({
            message: allTransaction
        })
    }catch(error){
        res.status(500).json({
            message: "Sever error: " + error
        });
    }
}