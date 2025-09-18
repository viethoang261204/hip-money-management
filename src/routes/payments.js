const express = require('express');
const router = express.Router();
const { Person, Loan, Payment } = require('../models');

// List payments
router.get('/', async (req, res, next) => {
	try {
		const payments = await Payment.findAll({
			include: [{ model: Loan, include: [Person] }],
			order: [['paidAt', 'DESC'], ['createdAt', 'DESC']],
		});
		res.render('payments', { title: 'Thanh toán', payments });
	} catch (err) { next(err); }
});

// New payment form
router.get('/new', async (req, res, next) => {
	try {
		const loans = await Loan.findAll({ include: [Person], order: [['createdAt', 'DESC']] });
		const loanId = req.query.loanId || '';
		res.render('payment_form', { title: 'Thêm thanh toán', payment: {}, loans, loanId, isEdit: false });
	} catch (err) { next(err); }
});

// Create payment
router.post('/', async (req, res, next) => {
	try {
		const { loanId, amount, paidAt, method, note } = req.body;
		await Payment.create({ loanId, amount, paidAt, method, note });
		res.redirect(`/loans/${loanId}`);
	} catch (err) { next(err); }
});

// Edit payment form
router.get('/:id/edit', async (req, res, next) => {
	try {
		const payment = await Payment.findByPk(req.params.id);
		if (!payment) return res.sendStatus(404);
		const loans = await Loan.findAll({ include: [Person], order: [['createdAt', 'DESC']] });
		res.render('payment_form', { title: 'Sửa thanh toán', payment, loans, loanId: payment.loanId, isEdit: true });
	} catch (err) { next(err); }
});

// Update payment
router.put('/:id', async (req, res, next) => {
	try {
		const payment = await Payment.findByPk(req.params.id);
		if (!payment) return res.sendStatus(404);
		const { loanId, amount, paidAt, method, note } = req.body;
		await payment.update({ loanId, amount, paidAt, method, note });
		res.redirect(`/loans/${loanId}`);
	} catch (err) { next(err); }
});

// Delete payment
router.delete('/:id', async (req, res, next) => {
	try {
		const payment = await Payment.findByPk(req.params.id);
		if (!payment) return res.sendStatus(404);
		const loanId = payment.loanId;
		await payment.destroy();
		res.redirect(`/loans/${loanId}`);
	} catch (err) { next(err); }
});

module.exports = router;


