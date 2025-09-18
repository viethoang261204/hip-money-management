const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Payment extends Model {}

Payment.init(
{
	amount: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: false,
	},
	paidAt: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	method: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	loanId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	note: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
},
{
	sequelize,
	modelName: 'Payment',
	tableName: 'payments',
}
);

module.exports = Payment;


