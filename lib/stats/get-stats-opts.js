var dao = require('../dao');
var get_diff = require('./get-diff.js');
var get_meta = require('./get-meta.js');
var predict = require('./predict.js');

module.exports = function(uid, days, cb, future_days){
  var getUser = (uid/1) ? dao.getUser : dao.getUserByHandle;
  getUser(uid, function(e, usr){
    if (!usr){
      return cb(true);
    }
    dao.getFollowersSmall(usr.id, days, function(e, followers){
      followers = future_days ? predict(followers, get_diff(followers, days), future_days) : followers;
      dao.getStatuses(usr.id, days, function(e, statuses){
        statuses = future_days ? predict(statuses, get_diff(statuses, days), future_days) : statuses;
        dao.getFavorites(usr.id, days, function(e, favorites){
          favorites = future_days ? predict(favorites, get_diff(favorites, days), future_days) : favorites;
          dao.getFollowing(usr.id, days, function(e, following){
            following = future_days ? predict(following, get_diff(following, days), future_days) : following;
            var type = future_days ? 'forecast' : 'stats';
            var title = usr.name+' < social media '+type+' | Followgen';
            var meta = {
              diff_followers:get_diff(followers, days),
              diff_statuses:get_diff(statuses, days),
              diff_favorites:get_diff(favorites, days),
              diff_following:get_diff(following, days),
              meta_followers:get_meta(followers), 
              meta_statuses:get_meta(statuses),
              meta_favorites:get_meta(favorites),
              meta_following:get_meta(following),
              following:following,
              days:days,
              favorites:favorites,
              followers:followers, 
              statuses:statuses,
              uid:uid, 
              user:usr, 
              type:type,
              future_days:future_days,
              title:title, 
              description:usr.description
            };
            return cb(e, meta);
          });
        });
      });
    });
  });
}
