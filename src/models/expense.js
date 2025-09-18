const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Expense extends Model {}

Expense.init(
{
	spentAt: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	amount: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: false,
	},
	category: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true,
	},
},
{
	sequelize,
	modelName: 'Expense',
	tableName: 'expenses',
}
);

module.exports = Expense;


