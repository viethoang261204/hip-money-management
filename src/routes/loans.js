const express = require('express');
const router = express.Router();
const { Person, Loan, Payment, Setting } = require('../models');

async function computeLoanSums(loans) {
	const results = await Promise.all(
		loans.map(async (loan) => {
			const paid = (await Payment.sum('amount', { where: { loanId: loan.id } })) || 0;
			const amount = Number(loan.amount);
			const remaining = amount - Number(paid);
			const percent = amount ? Math.round((Number(paid) / amount) * 100) : 0;
			return { loan, paid: Number(paid), remaining, percent };
		})
	);
	return results;
}

// List loans
router.get('/', async (req, res, next) => {
	try {
		const loans = await Loan.findAll({ include: [Person], order: [['createdAt', 'DESC']] });
		let enriched = await computeLoanSums(loans);
		// Auto-remove fully paid loans
		const toDelete = enriched.filter(i => i.percent >= 100).map(i => i.loan.id);
		if (toDelete.length) {
			await Loan.destroy({ where: { id: toDelete } });
			enriched = enriched.filter(i => !toDelete.includes(i.loan.id));
		}
		res.render('loans', { title: 'Khoản vay/nợ', loans: enriched });
	} catch (err) { next(err); }
});

// New loan form
router.get('/new', async (req, res, next) => {
	try {
		const people = await Person.findAll({ order: [['name', 'ASC']] });
		res.render('loan_form', { title: 'Thêm khoản', loan: {}, people, isEdit: false });
	} catch (err) { next(err); }
});

// Create loan
router.post('/', async (req, res, next) => {
	try {
		const { personId, direction, amount, interestRate, startDate, dueDate, note } = req.body;
		const loan = await Loan.create({ personId, direction, amount, interestRate, startDate, dueDate, note });
		// Adjust wallet: borrowing adds cash, lending reduces cash
		let setting = await Setting.findByPk(1);
		if (!setting) setting = await Setting.create({ id: 1, currentWallet: 0 });
		const delta = direction === 'borrow' ? Number(amount || 0) : -Number(amount || 0);
		await setting.update({ currentWallet: Number(setting.currentWallet || 0) + delta });
		res.redirect('/loans');
	} catch (err) { next(err); }
});

// Loan detail
router.get('/:id', async (req, res, next) => {
	try {
		const loan = await Loan.findByPk(req.params.id, { include: [Person] });
		if (!loan) return res.sendStatus(404);
		const payments = await Payment.findAll({ where: { loanId: loan.id }, order: [['paidAt', 'DESC'], ['createdAt', 'DESC']] });
		const paid = (await Payment.sum('amount', { where: { loanId: loan.id } })) || 0;
		const remaining = Number(loan.amount) - Number(paid);
		const percent = Number(loan.amount) ? Math.round((Number(paid) / Number(loan.amount)) * 100) : 0;
		res.render('loan_detail', { title: 'Chi tiết khoản', loan, payments, paid: Number(paid), remaining, percent });
	} catch (err) { next(err); }
});

// Edit loan form
router.get('/:id/edit', async (req, res, next) => {
	try {
		const loan = await Loan.findByPk(req.params.id);
		if (!loan) return res.sendStatus(404);
		const people = await Person.findAll({ order: [['name', 'ASC']] });
		res.render('loan_form', { title: 'Sửa khoản', loan, people, isEdit: true });
	} catch (err) { next(err); }
});

// Update loan
router.put('/:id', async (req, res, next) => {
	try {
		const loan = await Loan.findByPk(req.params.id);
		if (!loan) return res.sendStatus(404);
		const { personId, direction, amount, interestRate, startDate, dueDate, note } = req.body;
		await loan.update({ personId, direction, amount, interestRate, startDate, dueDate, note });
		res.redirect('/loans');
	} catch (err) { next(err); }
});

// Delete loan
router.delete('/:id', async (req, res, next) => {
	try {
		const loan = await Loan.findByPk(req.params.id);
		if (!loan) return res.sendStatus(404);
		await loan.destroy();
		res.redirect('/loans');
	} catch (err) { next(err); }
});

module.exports = router;


