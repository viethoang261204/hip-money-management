const express = require('express');
const router = express.Router();
const { Person, Loan, Payment, Expense, Setting } = require('../models');

router.get('/', async (req, res, next) => {
	try {
		const [peopleCount, loansCount, paymentsCount, expensesSum] = await Promise.all([
			Person.count(),
			Loan.count(),
			Payment.count(),
			Expense.sum('amount')
		]);
		let setting = await Setting.findByPk(1);
		if (!setting) setting = await Setting.create({ id: 1, monthlyIncome: 0, walletBalance: 0, currentWallet: 0 });
		const payments = await Payment.findAll({ include: [{ model: Loan }] });
		const paidLend = payments.filter(p => p.Loan && p.Loan.direction === 'lend').reduce((s, p) => s + Number(p.amount || 0), 0);
		const paidBorrow = payments.filter(p => p.Loan && p.Loan.direction === 'borrow').reduce((s, p) => s + Number(p.amount || 0), 0);
		const totalExpenses = Number(expensesSum || 0);
		const walletRemaining = Number(setting.currentWallet || 0) - Number(paidBorrow || 0) - totalExpenses + Number(paidLend || 0);
		res.render('index', { title: 'Quản lý Nợ & Vay', peopleCount, loansCount, paymentsCount, setting, totalExpenses, walletRemaining });
	} catch (err) { next(err); }
});

router.post('/settings', async (req, res, next) => {
	try {
		let setting = await Setting.findByPk(1);
		if (!setting) setting = await Setting.create({ id: 1 });
		let { monthlyIncome, walletBalance } = req.body;
		monthlyIncome = Number(monthlyIncome || 0);
		walletBalance = Number(walletBalance || 0);
		const deltaIncome = Math.max(0, monthlyIncome - Number(setting.monthlyIncome || 0));
		const newCurrent = Number(setting.currentWallet || 0) + deltaIncome;
		await setting.update({ monthlyIncome, walletBalance, currentWallet: newCurrent });
		res.redirect('/');
	} catch (err) { next(err); }
});

router.post('/income/add', async (req, res, next) => {
	try {
		let setting = await Setting.findByPk(1);
		if (!setting) setting = await Setting.create({ id: 1, currentWallet: 0 });
		const add = Number(req.body.amount || 0);
		await setting.update({ currentWallet: Number(setting.currentWallet || 0) + add });
		res.redirect('/');
	} catch (err) { next(err); }
});

module.exports = router;


