var dao = require('../dao')
, get_user = require('./get-user.js');

module.exports = function(id, token, secret, cb){
  get_user(id, token, secret, function(e, user){
    if (!e) return dao.recordTwitterUser(user, cb);
    return cb(e);
  });
};
