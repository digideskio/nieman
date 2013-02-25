var dao = require('../dao');

function reject(req, res){
  res.redirect('/');
}

module.exports = function(req, res, next){
  if (req.session && req.session.auth_data && req.session.auth_data.id){
    dao.isPremium(req.session.auth_data.id, function(e, is_premium){
      if (!is_premium) return reject(req, res);
      next();
    });
  } else {
    reject(req, res);
  }
};
