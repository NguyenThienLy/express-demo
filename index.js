require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

var userRoute = require('./routes/user.route');
var productRoute = require('./routes/product.route');
var authRoute = require('./routes/auth.route');
var cartRoute = require('./routes/cart.route')

var apiProductRoute = require('./api/routes/product.route');
var apiUserRoute = require('./api/routes/user.route')

var authMiddleware = require('./middlewares/auth.middleware');
var sessionMiddleware = require('./middlewares/session.middleware');

var port = 3000;

var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);

app.use(express.static('public'));

app.get('/',function( req, res) {
	res.render('login');
});

app.get('/404NotFound',function( req, res) {
	res.render('404NotFound');
});

app.use('/users', authMiddleware.requireAuth, userRoute);
app.use('/products', productRoute);
app.use('/auth', authRoute);
app.use('/cart', cartRoute);
app.use('/api/products',apiProductRoute);
app.use('/api/users',apiUserRoute);

app.listen(port, function(){
	console.log('Server listening on port'+ port);
});