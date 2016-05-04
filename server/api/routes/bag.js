var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
    auto_reconnect: true
});

db = new Db('starwarsstore', server);

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'starwarsstore' database");
        db.collection('shoppingcart', {
            strict: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'shoppingcart' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findAll = function(req, res) {
    db.collection('shoppingcart', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addProduct = function(req, res) {
    var product = req.body;
    console.log('Adding product: ' + JSON.stringify(product));
    db.collection('shoppingcart', function(err, collection) {
        collection.insert(product, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.deleteProduct = function(req, res) {
    var id = req.params.id;
    console.log('Deleting product: ' + id);
    db.collection('shoppingcart', function(err, collection) {
        collection.remove({
            '_id': new BSON.ObjectID(id)
        }, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

// Populate database with sample data. Only used once: the first time the application is started.
var populateDB = function() {
    var shoppingcart = [{
        'items': [{
            'id': '0',
            'product_id': 'prod-c3po',
            'quantity': '1',
            'amount': '100'
        }, {
            'id': '1',
            'product_id': 'prod-storm',
            'quantity': '1',
            'amount': '200'
        }],
        'amount': '300'
    }];

    db.collection('shoppingcart', function(err, collection) {
        collection.insert(shoppingcart, {
            safe: true
        }, function(err, result) {});
    });
};