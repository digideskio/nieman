var util = require('util');

module.exports =  function(req, res, next){
  next();
  util.log('SESSION '+JSON.stringify(req.session));
}
