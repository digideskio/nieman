var dao = require('../lib/dao.js');
var s = new Date().getTime();

dao.client.keys('*handle*', function(e, data){
  var f = new Date().getTime();
  console.log(f-s);
  console.log(data.length);
  data.forEach(function(key){
    dao.client.move(key, 1, function(e, res){
      console.log(e, res);
    });
  });
});
