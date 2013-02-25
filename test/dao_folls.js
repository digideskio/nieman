var dao = require('../lib/dao.js');
dao.getFollowers(12345, 10, function(e, r){
  console.log(arguments);
});
