const path = require('path');
const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;
let sequelize;

if (databaseUrl) {
	sequelize = new Sequelize(databaseUrl, {
		dialect: 'postgres',
		protocol: 'postgres',
		logging: false,
		dialectOptions: process.env.NODE_ENV === 'production' ? { ssl: { require: true, rejectUnauthorized: false } } : {},
	});
} else {
	const databaseFilePath = process.env.DATABASE_FILE || path.join(__dirname, '..', 'data.sqlite');
	sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: databaseFilePath,
		logging: false,
	});
}

module.exports = { sequelize };


