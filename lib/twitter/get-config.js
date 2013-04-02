var twitter_config = require('../config').twitter;

module.exports = function(user){
  return {
    consumer_key:twitter_config.consumer_key,
    consumer_secret:twitter_config.consumer_secret,
    access_token_key: user.token,
    access_token_secret: user.secret
  };
};
