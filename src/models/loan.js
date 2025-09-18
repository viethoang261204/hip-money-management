const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Loan extends Model {}

Loan.init(
{
	amount: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: false,
	},
	interestRate: {
		type: DataTypes.DECIMAL(5, 2),
		allowNull: true,
	},
	startDate: {
		type: DataTypes.DATEONLY,
		allowNull: true,
	},
	dueDate: {
		type: DataTypes.DATEONLY,
		allowNull: true,
	},
	// 'borrow' = you borrowed money (you owe). 'lend' = you lent money (others owe you)
	direction: {
		type: DataTypes.ENUM('borrow', 'lend'),
		allowNull: false,
	},
	personId: {
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
	modelName: 'Loan',
	tableName: 'loans',
}
);

module.exports = Loan;


