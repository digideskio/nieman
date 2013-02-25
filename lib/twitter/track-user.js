var dao = require('./dao.js');
var util = require('util');
var _config = require('./config.js').twitter;
var get_client = require('./get-client.js');
var NUM_USERS;
var handle = process.argv[2];

if (!handle) {
  console.log('supply handle');
  process.exit();
}

function getRandomTwitterClient(cb){
  dao.getRandomCustomer(function(e, user){
    var config = {
      consumer_key:_config.consumer_key,
      consumer_secret:_config.consumer_secret,
      access_token_key:user.token,
      access_token_secret:user.secret
    };
    return cb(e, get_client(config));
  });
};

function recordFollowers(twit){
  twit.showUser(handle, function(e, data){
    var user = data[0];
    dao.recordTwitterUser(user, function(e, res){
     if (res){
       console.log(user, 'tracked');
       process.exit();
     } else {
       console.log('fail'); 
     }
    });
  });
};

getRandomTwitterClient(function(e, twit){
  recordFollowers(twit);
});
