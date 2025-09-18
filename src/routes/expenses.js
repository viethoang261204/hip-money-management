const express = require('express');
const router = express.Router();
const { Expense } = require('../models');

router.get('/', async (req, res, next) => {
	try {
		const expenses = await Expense.findAll({ order: [['spentAt', 'DESC'], ['createdAt', 'DESC']] });
		const total = (await Expense.sum('amount')) || 0;
		res.render('expenses', { title: 'Khoản chi tiêu', expenses, total });
	} catch (err) { next(err); }
});

router.get('/new', (req, res) => {
	res.render('expense_form', { title: 'Thêm chi tiêu', expense: {}, isEdit: false });
});

router.post('/', async (req, res, next) => {
	try {
		const { spentAt, amount, category, description } = req.body;
		await Expense.create({ spentAt, amount, category, description });
		res.redirect('/expenses');
	} catch (err) { next(err); }
});

router.get('/:id/edit', async (req, res, next) => {
	try {
		const expense = await Expense.findByPk(req.params.id);
		if (!expense) return res.sendStatus(404);
		res.render('expense_form', { title: 'Sửa chi tiêu', expense, isEdit: true });
	} catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
	try {
		const expense = await Expense.findByPk(req.params.id);
		if (!expense) return res.sendStatus(404);
		const { spentAt, amount, category, description } = req.body;
		await expense.update({ spentAt, amount, category, description });
		res.redirect('/expenses');
	} catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
	try {
		const expense = await Expense.findByPk(req.params.id);
		if (!expense) return res.sendStatus(404);
		await expense.destroy();
		res.redirect('/expenses');
	} catch (err) { next(err); }
});

module.exports = router;


