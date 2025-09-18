const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Person extends Model {}

Person.init(
{
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: { notEmpty: true },
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	note: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
},
{
	sequelize,
	modelName: 'Person',
	tableName: 'people',
}
);

module.exports = Person;


