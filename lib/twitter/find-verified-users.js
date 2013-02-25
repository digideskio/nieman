var dao = require('./dao.js');
var util = require('util');
var _config = require('./config.js').twitter;
var get_client = require('./get-client.js');

function getRandomTwitterClient(cb){
  dao.getRandomUser(function(e, user){
    var config = {
      consumer_key:_config.consumer_key,
      consumer_secret:_config.consumer_secret,
      access_token_key:user.token,
      access_token_secret:user.secret
    };
    return cb(e, get_client(config));
  });
};

function recoverFromError(){
  console.log('**recover**');
  getRandomTwitterClient(function(e, twit){
    findVerifiedUsers(twit);
  });
}

function findVerifiedUsers(twit){
  console.log('**finding verified**');
  twit.getFriendsIds({screen_name:'verified', stringify_ids:true}, function(e, data){

    if (e){
      console.error(e);
      return recoverFromError();
    }

    console.log('got', data.length, 'friends');

    dao.addDataUser(data, function(e, r){
      if (e) console.log(e);
      !e && util.log(r);
      process.exit();
    });
  });
  
};

util.log('***BEGIN***');
recoverFromError();
