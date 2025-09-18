const { sequelize, Person, Loan, Payment } = require('./models');

(async () => {
	await sequelize.sync({ force: true });
	const alice = await Person.create({ name: 'Alice', phone: '0901', note: 'Bạn' });
	const bob = await Person.create({ name: 'Bob', phone: '0902' });

	const l1 = await Loan.create({ personId: alice.id, direction: 'lend', amount: 5000000, interestRate: 0, startDate: '2025-09-01', note: 'Cho Alice mượn' });
	const l2 = await Loan.create({ personId: bob.id, direction: 'borrow', amount: 2000000, startDate: '2025-09-05', dueDate: '2025-10-05', note: 'Mượn Bob' });

	await Payment.create({ loanId: l1.id, amount: 1000000, paidAt: '2025-09-10', method: 'Tiền mặt' });
	await Payment.create({ loanId: l2.id, amount: 500000, paidAt: '2025-09-12' });

	console.log('Seeded.');
	process.exit(0);
})();


