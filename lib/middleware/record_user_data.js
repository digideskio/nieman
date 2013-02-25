var record_user = require('../twitter/record-user.js');

module.exports = function(req, res, next){
  record_user(req.user.id, req.session.auth_data.token, req.session.auth_data.secret, function(){
    next();
  });
};
