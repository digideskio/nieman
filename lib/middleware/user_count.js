var dao = require('../dao');

module.exports = function(req, res, next){
  dao.getUserCount(function(e, user_count){
    if (!e) req.user_count = user_count;
    next();
  });
};
