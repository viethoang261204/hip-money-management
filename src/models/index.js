const { sequelize } = require('../db');
const Person = require('./person');
const Loan = require('./loan');
const Payment = require('./payment');
const Expense = require('./expense');
const Setting = require('./setting');

// Associations
Person.hasMany(Loan, { foreignKey: 'personId', onDelete: 'CASCADE' });
Loan.belongsTo(Person, { foreignKey: 'personId' });

Loan.hasMany(Payment, { foreignKey: 'loanId', onDelete: 'CASCADE' });
Payment.belongsTo(Loan, { foreignKey: 'loanId' });

module.exports = { sequelize, Person, Loan, Payment, Expense, Setting };


