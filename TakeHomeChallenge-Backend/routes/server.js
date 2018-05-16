var express = require('express');
var router = express.Router();
var mysql = require('../middleware/mysql');
var jwt = require('jsonwebtoken');

const TOKENTIME = 60*60*24*7*54*20; //sec*min*day*week*year*20 
const SECRET = 'thisismysecret'; //Secret message

let authenticate = function(req, res, next){
  var token = req.body.headers.Authorization.substring(7, req.body.headers.Authorization.length);
  jwt.verify(token,SECRET, function(err, decoded){
    if(err){
      res.json({
        status:403,
        message:err.message
      })
    }
    else{
      req.decoded = decoded;
      next();
    }
  })
}

router.post('/serverList', authenticate, (req, res, next) => {
  var getServerListQuery = 'SELECT * FROM takeHomeChallenge.Server'
  mysql.run_aQuery(getServerListQuery, function(err, result){
    if(err){
      throw err;
      res.json({
        status:403
      })
    }
    else{
      console.log(result);
      res.json({
        status:200,
        result:result
      })
    }
  })
});

router.post('/serverDetails', authenticate, (req, res, next) => {
  var getServerDetails = 'SELECT Server.name, Server.ip_address, Server.location, Server.status, ServerDetails.cpu_usage, ServerDetails.events_processed FROM takeHomeChallenge.ServerDetails, takeHomeChallenge.Server where Server.id=ServerDetails.server_id and ServerDetails.server_id='+req.query.server_id+'';
  mysql.run_aQuery(getServerDetails, function(err, result){
    if(err){
      throw err;
      res.json({
        status:403
      })
    }
    else{
      console.log(result);
      res.json({
        status:200,
        result:result
      })
    }
  })
})

module.exports = router;
