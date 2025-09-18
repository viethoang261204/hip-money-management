const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const dayjs = require('dayjs');

const { sequelize } = require('./db');
const { Person, Loan, Payment } = require('./models');
const indexRouter = require('./routes/index');
const expensesRouter = require('./routes/expenses');

const peopleRouter = require('./routes/people');
const loansRouter = require('./routes/loans');
const paymentsRouter = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Locals
app.locals.dayjs = dayjs;
app.locals.formatVND = (n) => {
	const num = Number(n || 0);
	return Number.isFinite(num) ? num.toLocaleString('vi-VN') : '';
};
app.locals.expenseCategories = [
	'Ăn uống',
	'Siêu thị/Tạp hóa',
	'Đi lại',
	'Nhà cửa/Thuê nhà',
	'Điện/Nước/Gas',
	'Internet/Điện thoại',
	'Sức khỏe',
	'Giáo dục',
	'Giải trí',
	'Mua sắm',
	'Quà tặng',
	'Du lịch',
	'Bảo hiểm',
	'Tiết kiệm/Đầu tư',
	'Phí/Ngân hàng',
	'Khác',
];

// Routes
app.use('/', indexRouter);

app.use('/people', peopleRouter);
app.use('/loans', loansRouter);
app.use('/payments', paymentsRouter);
app.use('/expenses', expensesRouter);

// DB init and server start
(async () => {
	await sequelize.sync();
	app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
})();


