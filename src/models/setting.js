const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Setting extends Model {}

Setting.init(
{
	monthlyIncome: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: true,
		defaultValue: 0,
	},
	walletBalance: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: true,
		defaultValue: 0,
	},
	currentWallet: {
		type: DataTypes.DECIMAL(18, 2),
		allowNull: false,
		defaultValue: 0,
	},
},
{
	sequelize,
	modelName: 'Setting',
	tableName: 'settings',
}
);

module.exports = Setting;


