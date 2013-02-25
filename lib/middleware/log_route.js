var util = require('util');

module.exports =  function(req, res, next){
  next();
  var data;
  if (req.mehod==='GET'){
    data = req.query;
  } else {
    data = req.body
  }
  var uid = req.session && req.session.user ? req.session.user.id : '';
  util.log(uid+' '+req.method+' '+req.path+' '+JSON.stringify(data)+' '+JSON.stringify(req.headers['user-agent']));
}
