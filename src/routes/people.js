const express = require('express');
const router = express.Router();
const { Person } = require('../models');

// List people
router.get('/', async (req, res, next) => {
	try {
		const people = await Person.findAll({ order: [['createdAt', 'DESC']] });
		res.render('people', { title: 'Người', people });
	} catch (err) { next(err); }
});

// New person form
router.get('/new', (req, res) => {
	res.render('person_form', { title: 'Thêm người', person: {}, isEdit: false });
});

// Create person
router.post('/', async (req, res, next) => {
	try {
		const { name, phone, note } = req.body;
		await Person.create({ name, phone, note });
		res.redirect('/people');
	} catch (err) { next(err); }
});

// Edit person form
router.get('/:id/edit', async (req, res, next) => {
	try {
		const person = await Person.findByPk(req.params.id);
		if (!person) return res.sendStatus(404);
		res.render('person_form', { title: 'Sửa người', person, isEdit: true });
	} catch (err) { next(err); }
});

// Update person
router.put('/:id', async (req, res, next) => {
	try {
		const person = await Person.findByPk(req.params.id);
		if (!person) return res.sendStatus(404);
		const { name, phone, note } = req.body;
		await person.update({ name, phone, note });
		res.redirect('/people');
	} catch (err) { next(err); }
});

// Delete person
router.delete('/:id', async (req, res, next) => {
	try {
		const person = await Person.findByPk(req.params.id);
		if (!person) return res.sendStatus(404);
		await person.destroy();
		res.redirect('/people');
	} catch (err) { next(err); }
});

module.exports = router;


