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

/* GET users listing. */
router.get('/login', (req, res, next) => {
  var email = req.query.email;
  var password = req.query.password;
  var loginQuery = 'SELECT * FROM takeHomeChallenge.User where email="'+ email +'" and password="'+ password +'"';
  mysql.run_aQuery(loginQuery,function(err, results){
    if(err){
      throw err;
      res.json({
        status:403,
        success:'no'
      })
    }
    else if (results.length < 1){
      res.json({
        status:401,
        success:'no'
      })
    }
    else{
      var user = results[0];
      req.token = req.token || {};
      req.token = jwt.sign ({
        id: user.id,
      }, SECRET, {
        expiresIn: TOKENTIME // 20 years
      });
      var pushAuthTokenQuery = 'UPDATE takeHomeChallenge.User SET authentication_token="'+req.token+'" WHERE id="'+user.id+'"';
      mysql.run_aQuery(pushAuthTokenQuery, function(err, results){
        if(err){
          throw err;
        }
        else{
          res.json({
            status:200,
            success: true,
            user: user.email,
            token: req.token,
            name : user.first_name
          });
        }
      })
    }
  });
});

router.post('/logout',authenticate,(req, res, next)=>{
  console.log("logging out...");
  var logoutQuery = 'UPDATE takeHomeChallenge.User SET authentication_token= "" WHERE id="'+req.decoded.id+'"';
  mysql.run_aQuery(logoutQuery, function(err, result){
    if(err)
      throw err;
    else{
      res.json({
        status:200
      })
    }
  })
})

module.exports = router;
