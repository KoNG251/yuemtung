const {DataTypes} = require('sequelize');
const sequelize = require('../config/db')

const Transaction = sequelize.define('transactions',{
    borrower_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    transaction_type: {
        type: DataTypes.ENUM('borrow','repay'),
        allowNull: false
    }
})

module.exports = { Transaction };