var express = require('express'),
	product = require('./server/api/routes/products'),
	bag = require('./server/api/routes/bag'),
	bodyParser = require('body-parser');;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/products', product.findAll);
app.get('/api/shoppingcart', bag.findAll);

app.post('/api/shoppingcart/items', bag.addProduct);
app.delete('/api/shoppingcart/items/:id', bag.deleteProduct);


app.listen(3002);
console.log('Listening the API on port 3002...');
