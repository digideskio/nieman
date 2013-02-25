var twitter = require('ntwitter');

module.exports = function(config){
  return new twitter(config);
}
