var format_targets = require('../lib/target/format_target.js');
var dao = require('../lib/dao');

dao.getAllPremium(function(e, users){
  users.forEach(function(user){
    user.targets = format_targets([user.target_a, user.target_b, user.target_c]).join(',');
    dao.setUser(user.id, user, console.log);
  });
});
