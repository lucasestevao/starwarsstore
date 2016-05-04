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
        db.collection('products', {
            strict: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'products' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findAll = function(req, res) {
    db.collection('products', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

// Populate database with sample data. Only used once: the first time the application is started.
var populateDB = function() {
    var products = [{
        'name': 'C3PO dictionary',
        'id': 'prod-c3po',
        'price': '100',
        'img': 'C3PO-dictionary.png'
    }, {
        'name': 'Storm Blast',
        'id': 'prod-storm',
        'price': '200',
        'img': 'storm-tropper-blast.png'
    }, {
        'name': 'Darth Vader light saber',
        'id': 'prod-darth',
        'price': '400',
        'img': 'darth-vader-light-saber.png'
    }, {
        'name': 'Boba Fett hunter manual',
        'id': 'prod-boba',
        'price': '300',
        'img': 'boba-fett-hunter-manual.png'
    }];

    db.collection('products', function(err, collection) {
        collection.insert(products, {
            safe: true
        }, function(err, result) {});
    });
};