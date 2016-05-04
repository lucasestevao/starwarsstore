'use strict'

var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/frontend/public'));

app.listen('3000',function(){
	console.log('Server running at http://localhost:3000')
})

app.get('/',function(req,res){
	res.sendFile('index.html',{'root':__dirname + '/frontend/public'});
})