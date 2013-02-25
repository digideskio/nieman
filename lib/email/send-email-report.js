var dao = require('../dao');
var send = require('email-toolkit');
var util = require('util');
var uid = process.argv[2];
var getUserStatsOpts = require('../stats/get-stats-opts.js');


getUserStatsOpts(uid, 10, function(e, opts){

  if (opts.meta_followers.days<7){
   process.exit();
  }

  var msg = '';
  msg+='Hi '+opts.user.name.split(' ')[0]+', \n\n';
  msg+='Over the past week, you\'ve: \n\n'
  msg+='Gained '+opts.meta_followers.gain+' followers ('+opts.meta_followers.velocity+' per day) total : '+opts.meta_followers.end+' \n';
  msg+='Made '+opts.meta_statuses.gain+' tweets ('+opts.meta_statuses.velocity+' per day) total : '+opts.meta_statuses.end+' \n';
  msg+='Followed '+opts.meta_following.gain+' people ('+opts.meta_following.velocity+' per day) total : '+opts.meta_following.end;
  msg+='\n\n';

  if (opts.user.targets){
    msg+='You\'re targeting: \n ';
    opts.user.targets.forEach(function(t){
      msg+=t+'\n';
    });
  }

  msg+='\n\n';
  msg+='I\'ve linked to your stats page below.\n\n';
  msg+='http://followgen.com/stats/'+opts.user.screen_name+ '\n\n';
  msg+='Have a fantastic day, and feel free to contact me anytime';;

  var date = new Date().toString().split(' ').splice(0, 3).join(' ');

  var email_opts = {
    to: opts.user.email,
    from: 'myles@followgen.com',
    title: 'Followgen report: '+date,
    text: msg
  };

  console.log(email_opts);

  send(email_opts, function(){
    console.log('mail finito', arguments);
    process.exit();
  });

});


