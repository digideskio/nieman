var dao = require('../lib/dao');

var name = process.argv[2];
var display_name = process.argv[3];
var email = process.argv[4];
var limit = process.argv[5];
var image_url = process.argv[6];
var copy = process.argv[7];
var consumer_key = process.argv[8];
var consumer_secret = process.argv[9];

if (!(name && email && limit && display_name && copy && image_url
  && consumer_key && consumer_secret)){
  console.error('usage: url_name display_name email limit image_url copy key secret');
  process.exit();
}

var opts = {
  name:name,
  email:email,
  image_url:image_url,
  copy:copy,
  display_name:display_name,
  limit:limit,
  consumer_key:consumer_key,
  consumer_secret:consumer_secret
};

console.log(opts);

dao.setOwner(name, opts, function(){
  console.log(arguments);
  process.exit();
});
