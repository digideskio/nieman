var get_client = require('../../lib/twitter/get-client.js');
var get_config = require('../../lib/twitter/get-config.js');

var steph_config = get_config({
  token:'232439599-6UUAB5obSvFTnHiE3Xiuq65iQyBOJXJ06eytWY3Y',
  secret:'alLZa5Ia3VQO46Mx1TyCR69Oxm9R3zS72DUADR4Ebp4'
});

console.log(steph_config);

var twitter = get_client(steph_config);

module.exports = function(req, res){

  twitter.search('to:'+req.params.user, {rpp:200, result_type:'recent'}, function(e, data){
    if (!e && data && data.results.length){
      var users = {};
      data.results.forEach(function(m){
        users[m.from_user_name] = m;
      });
      twitter.showUser(req.params.user, function(e, studio){
        var studio = studio[0] || null;
        res.render('studiocrm', {hide_footer:true, studio:studio, users:users, active:false});
      });
    } else {
      res.redirect('/');
    }
  });

};
