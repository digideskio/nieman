var dao = require('../lib/dao');
dao.getAllPremium(function(e, users){
  users.forEach(function(user){
    user.plan = 'enterprise';
    dao.setUser(user.id, user, console.log);
  });
});
