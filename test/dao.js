var dao = require('../lib/dao.js');
dao.getAllUsers(function(){
  console.log(arguments);
});
