var dao = require('../../lib/dao');

function get_owner_name(host){
  var chunks = host.split('.');
  return chunks[0];
}

module.exports = function(req, res, next){
  var owner_name = get_owner_name(req.headers.host);
  dao.getOwner(owner_name, function(e, owner){
    if (!owner){
      return res.render('blank', {hide_signin:true, owner:{name:''}});
    }
    req.owner = owner;
    console.log(req.owner);
    next();
  });
};
