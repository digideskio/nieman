var express = require('express')
  , fs = require("fs")
  , routes = require('../routes');

var privateKey = fs.readFileSync('./key.pem').toString();
var certificate = fs.readFileSync('./certificate.pem').toString();  

// to enable https
var app = module.exports = express.createServer({key: privateKey, cert: certificate});
