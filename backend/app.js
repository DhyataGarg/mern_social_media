require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');
const statusRoutes = require('./routes/status');

const PORT = 8080;
const MONGO_URI = `mongodb://127.0.0.1:27017/social-media`;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE, OPTIONS'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/', statusRoutes);

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data });
});

mongoose.connect(MONGO_URI).then(result => {
	console.log('Database connected');
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
