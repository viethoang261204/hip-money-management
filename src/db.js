const path = require('path');
const { Sequelize } = require('sequelize');

const databaseFilePath = process.env.DATABASE_FILE || path.join(__dirname, '..', 'data.sqlite');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: databaseFilePath,
	logging: false,
});

module.exports = { sequelize };


