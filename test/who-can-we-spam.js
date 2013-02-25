var redis = require('redis').createClient();
var fs = require('fs');
var handles = JSON.parse(fs.readFileSync(__dirname+'/../data/handles.json'));

var existing = [];
var done = 0;
redis.select(1, function(){

  function check(handle){
    redis.exists('fgen:handle:'+handle.toLowerCase(), function(e, res){
      done+=1;
      if (res) existing.push(handle);
      if (done == handles.length){
        console.log(JSON.stringify(existing));
	process.exit();
      }
    });
  }
  handles.forEach(check);
});

