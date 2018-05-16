var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

const TOKENTIME = 60*60*24*7*54*20; //sec*min*day*week*year*20 
const SECRET = 'thisismysecret'; //Secret message


exports.authenticate = function(req, res, next){
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

let respond = (req, res) => {
  console.log("and here");
  res.status(200).json({
    success: true,
    user: req.user.username,
    token: req.token,
    name : req.user.name
  });
}
