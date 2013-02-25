var getUserStatsOpts = require('../routes').getUserStatsOpts;
var predict = require('../lib/predict.js');
var history_days = 40;
var future_days = 14;

getUserStatsOpts('232439599', history_days, function(e, stats){
  var stats = predict(stats.followers, stats.diff_followers, future_days);
  console.log(stats);
});

