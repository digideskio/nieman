var _config = require('../config').twitter;
var get_client = require('./get-client.js');

function getTwitterClient(token, secret){
  return get_client({
    consumer_key:_config.consumer_key,
    consumer_secret:_config.consumer_secret,
    access_token_key:token,
    access_token_secret:secret
  });
};

module.exports = function(uid, token, secret, cb){
  var twit = getTwitterClient(token, secret);
  twit.showUser(uid, function(e, data){
    if (data) data = data[0];  
    return cb(e, data);
  });
};
