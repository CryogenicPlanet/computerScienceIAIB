//Environment Variables
var port = process.env.PORT || 3000; // Port of server
//var dbPassword = process.env.Db;
//Libraries
var getenv = require('getenv'); // Library for Enviroment Variables, Used for Db Conn
var mysql = require('promise-mysql'); // Mysql Library, With Node Promises
var sha512 = require('sha512'); // Sha512 Library, Sha512 is a hash
var bodyParser = require('body-parser'); // Library for parsing data
var jsonParser = bodyParser.json(); // Using Data type Json
var cors = require("cors"); // Library for handling access headers
// Modules
var user = require("./Modules/userPage/user.js");
//Server Setup
var express = require('express'); // Framework for Node
var app = express(); // Establishing Express App
app.use(express.logger());  // Logging Connections
app.use(cors()); // Cors to Handle Url Authentication 
app.use(bodyParser.json()); // Using Body Parser
app.set('jwtTokenSecret', '95FEE00F5ED3C7650C40286EE4FB44DC38C55DDFAD1B692D80443F21F4007E2146547E4F04D1EE4495D6CD597DBD70545B6AFA6F219BAC5D2E700A7DFDD3D474'); // JWT Secret
var server = app.listen(port); // Set Port

var con = null; 
mysql.createConnection({
    host: getenv('IP'),
    user: getenv('C9_USER'),
    password: "",
    database: "c9"
}).then(function(connection) { con = connection });

    app.post('/addRequest',function(req,res){
        console.log(req.body)
   user.addRequest(req,res,con)
});
app.post('/updateRequest',function(req,res){
    
});
app.get('/getRequests',function(req,res){
    
});
app.get('/students',function(req, res) {
    
});
app.get('/teacher',function(req,res){
    
});