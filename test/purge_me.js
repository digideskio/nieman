var redis = require('redis').createClient();
var uid = '232439599';
redis.del('fgen:u:'+uid+':user');
redis.del('fgen:u:'+uid+':customer');
redis.srem('fgen:users', uid);
redis.srem('fgen:customers', uid);
redis.srem('fgen:premium', uid);
redis.keys('fgen:u:'+uid+':followers:*', function(e, keys){
  console.log(keys);
  keys.forEach(function(key){
    redis.del(key);
  });
});
redis.keys('fgen:u:'+uid+':statuses:*', function(e, keys){
  console.log(keys);
  keys.forEach(function(key){
    redis.del(key);
  });
});
redis.keys('*'+uid+'*', function(e, keys){
  console.log(keys);
  keys.forEach(function(key){
    redis.del(key);
  });
});
