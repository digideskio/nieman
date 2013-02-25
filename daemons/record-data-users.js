var dao = require('../lib/dao');
var util = require('util');
var _config = require('../lib/config').twitter;
var get_client = require('../lib/twitter/get-client.js');
var NUM_USERS;

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

function recoverFromError(ids){
  getRandomTwitterClient(function(e, twit){
    recordFollowers(twit, ids);
  });
}

function recordFollowers(twit, ids){
  if (!ids.length){
    util.log('***FIN '+NUM_USERS+' USERS***');
    process.exit();
  }

  var uid = ids.shift();

  twit.showUser(uid, function(e, data){
    if (e){
      console.error(e);
      return recoverFromError(ids);
    }
    var user = data[0];
    util.log(user.screen_name);
    dao.recordTwitterUser(user, function(e, r){
      dao.setFollowersSmall(uid, user.followers_count, function(e, res){
        dao.setStatuses(uid, user.statuses_count, function(e, res){
          recordFollowers(twit, ids);
        });
      });
    });
    
  });
};

dao.getAllUserIds(function(e, ids){
  NUM_USERS = ids.length;
  util.log('***BEGIN '+NUM_USERS+' USERS***');
  getRandomTwitterClient(function(e, twit){
    recordFollowers(twit, ids);
  });
});
