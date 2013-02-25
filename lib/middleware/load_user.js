var dao = require('../dao');

function reject(req, res){
  res.redirect('/');
}

module.exports = function(req, res, next){
  if (req.session && req.session.auth_data && req.session.auth_data.id){
    console.log(req.session.auth_data);
    dao.getUser(req.session.auth_data.id, function(e, user){
      console.log(user);
      if (e || !user) return reject();
      Object.keys(user).forEach(function(key){
        req.session[key] = user[key];
      });
      req.user = user;
      return next();
    });
  } else {
    return reject();
  }
};
