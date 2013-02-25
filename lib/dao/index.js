var redis = require('redis').createClient();
var redis_alt = require('redis').createClient();
// time in seconds to wait before favving again
// 2 days
var fave_time_limit = 2*24*60*60;
var plug_holes = require('./plug_holes.js');

function getDailyTs(skip){
  var interval = 24*60*60*1000; //a day
  var now = skip ? new Date(new Date().getTime() - (skip*interval)) : new Date();
  now.setHours(0,0,0,0);
  return now.getTime();
}

module.exports = {
  client : redis,
  incrementABResult : function(test, version, cb){
    redis.hincrby('fgen:ab:'+test, version, 1 ,cb);
  },
  getAllOwners : function(cb){
    redis.keys('owner:*', function(e, keys){
      var multi = redis.multi();
      keys.forEach(function(key){
        multi.hgetall(key);
      });
      multi.exec(cb);
    });
  },
  setOwner : function(name, data, cb){
    redis.hmset('owner:'+name, data, cb);
  },
  getOwner : function(name, cb){
    redis.hgetall('owner:'+name, cb);
  },
  addOwnerUser : function(name, uid, cb){
    redis.sadd('owner:'+name+':users', uid, cb);
  },
  getOwnerUserCount: function(name, cb){
    redis.scard('owner:'+name+':users', cb);
  },
  getUserCount : function(cb){
    redis.scard('fgen:users', cb);
  },
  setUserFavPerformance : function(uid, term, suc, cb){
    redis.hset('fgen:u:'+uid+':target_perf', term, suc, cb);
  },
  getUserFavPerformance : function(uid, cb){
    redis.hgetall('fgen:u:'+uid+':target_perf', cb);
  },
  setUserFaved : function(uid, target_uid, cb){
    redis.setex('fgen:u:'+uid+':favd:'+target_uid, fave_time_limit, target_uid, cb);
  },
  shouldUserFave : function(uid, target_uid, cb){
    redis.exists('fgen:u:'+uid+':favd:'+target_uid, function(e, r){
      return cb(e, !r);
    });
  },
  setUser : function(uid, attrs, cb){
    redis.sadd('fgen:users', uid, function(e, r){
      redis.hmset('fgen:u:'+uid, attrs, cb);
    });
  },
  getUidByHandle : function(handle, cb){
    redis_alt.select(1, function(){
      redis_alt.get('fgen:handle:'+handle.toLowerCase(), cb);
    });
  },
  setHandleIdMap : function(handle, id, cb){
    redis_alt.select(1, function(){
      redis_alt.set('fgen:handle:'+handle.toLowerCase(), id, cb);
    });
  },
  recordTwitterUser : function(user, cb){
    module.exports.setHandleIdMap(user.screen_name, user.id_str, function(e, res){
      module.exports.setFollowersSmall(user.id_str, user.followers_count, function(){});
      module.exports.setStatuses(user.id_str, user.statuses_count, function(){});
      module.exports.setFollowing(user.id_str, user.friends_count, function(){});
      module.exports.setFavorites(user.id_str, user.favourites_count, function(){});
      module.exports.setUser(user.id_str, {
        id:user.id_str,
        name:user.name,
        profile_image_url:user.profile_image_url,
        followers_count:user.followers_count,
        friends_count:user.friends_count,
        statuses_count:user.statuses_count,
        favorites_count:user.favourites_count,
        description:user.description,
        created_at:user.created_at,
        screen_name:user.screen_name
      }, cb);
    });
  },
  getMatchingHandles : function(q, max, cb){
    redis_alt.select(1, function(){
      redis_alt.keys('fgen:handle:'+q+'*', function(e, res){
        if (typeof max === 'function'){
          cb = max;
          max = res.length;
        }
        return cb(e, res.splice(0, max));
      });
    });
    
  },
  remUser : function(uid, cb){
    redis.srem('fgen:users', uid, cb);
  },
  remCustomer : function(uid, cb){
    redis.srem('fgen:customers', uid, cb);
  },
  purgeUser : function(uid, cb){
    module.exports.remCustomer(uid, function(e, r){
      module.exports.remUser(uid, cb);
    });
  },
  isCustomer : function(uid, cb){
    redis.sismember('fgen:customers', uid, cb);
  },
  getUser : function(uid, cb){
    redis.hgetall('fgen:u:'+uid, function(e, data){
      if (data && data.targets){
        data.targets = data.targets.split(',');
      }
      return cb(e, data);
    });
  },
  getUserByHandle : function(handle, cb){
    module.exports.getUidByHandle(handle, function(e, uid){
      module.exports.getUser(uid, cb);
    });
  },
  getRandomUser : function(cb){
    redis.srandmember('fgen:users', function(e, uid){
      module.exports.getUser(uid, cb);
    });
  },
  getMultipleRandomUsers : function(n, cb){
    var multi = redis.multi();
    for (var i = 0; i<n; i++){
      multi.srandmember('fgen:users');
    }
    multi.exec(function(e, ids){
      var multi = redis.multi();
      ids.forEach(function(id){
        multi.hgetall('fgen:u:'+id);
      });
      multi.exec(cb);
    });
  },
  getRandomCustomer : function(cb){
    redis.srandmember('fgen:premium', function(e, uid){
      module.exports.getUser(uid, cb);
    });
  },
  setFollowers : function(uid, followers, cb){
    redis.sadd('fgen:u:'+uid+':followers:'+getDailyTs(), followers, cb);
  },
  setFollowersSmall : function(uid, followers, cb){
    redis.set('fgen:u:'+uid+':followers:'+getDailyTs(), followers, cb);
  },
  setStatuses : function(uid, statuses, cb){
    redis.set('fgen:u:'+uid+':statuses:'+getDailyTs(), statuses, cb);
  },
  setFollowing : function(uid, following, cb){
    redis.set('fgen:u:'+uid+':following:'+getDailyTs(), following, cb);
  },
  setFavorites : function(uid, favorites, cb){
    redis.set('fgen:u:'+uid+':favorites:'+getDailyTs(), favorites, cb);
  },
  getFollowers : function(uid, numDays, cb){
    var multi = redis.multi();
    for (var i = 0; i<numDays; i++){
      multi.smembers('fgen:u:'+uid+':followers:'+getDailyTs(i));
    }
    var folls = {};
    multi.exec(function(e, res){
      if (e) return cb(e);
      res.reverse();
      res.forEach(function(f, i){
        folls[getDailyTs(res.length-i)] = f;
      });
      return cb(3, folls);
    });
  },
  getUserStat : function(uid, stat, numDays, cb){
    var multi = redis.multi();
    for (var i = 0; i<numDays; i++){
      multi.get('fgen:u:'+uid+':'+stat+':'+getDailyTs(i));
    }
    var stats = {};
    multi.exec(function(e, res){
      if (e) return cb(e);
      res.reverse();
      res.forEach(function(s, i){
        stats[getDailyTs(res.length-i)] = s;
      });
      return cb(e, plug_holes(stats));
    });
  },
  getStatuses : function(uid, numDays, cb){
    module.exports.getUserStat(uid, 'statuses', numDays, cb);
  },
  getFavorites : function(uid, numDays, cb){
    module.exports.getUserStat(uid, 'favorites', numDays, cb);
  },
  getFollowing : function(uid, numDays, cb){
    module.exports.getUserStat(uid, 'following', numDays, cb);
  },
  getFollowersSmall : function(uid, numDays, cb){
    module.exports.getUserStat(uid, 'followers', numDays, cb);
  },
  addDataUser : function(uid, cb){
    redis.sadd('fgen:data_users', uid, cb);
  },
  addPremium : function(uid, cb){
    redis.sadd('fgen:premium', uid, cb);
  },
  isPremium : function(uid, cb){
    redis.sismember('fgen:premium', uid, cb);
  },
  setCustomer : function(uid, data, cb){
    redis.sadd('fgen:customers', uid, function(e, r){
      redis.set('fgen:cus:'+uid, JSON.stringify(data), cb);
    });
  },
  getCustomer : function(uid, cb){
    redis.get('fgen:cus:'+uid, function(e, r){
      cb(e, JSON.parse(r));
    });
  },
  getAllCustomers : function(cb){
    redis.smembers('fgen:customers', function(e, r){
      var multi = redis.multi();
      r.forEach(function(uid){
        multi.hgetall('fgen:u:'+uid);
      });
      multi.exec(cb);
    });
  },
  getAllPremium : function(cb){
    redis.smembers('fgen:premium', function(e, r){
      var multi = redis.multi();
      r.forEach(function(uid){
        multi.hgetall('fgen:u:'+uid);
      });
      multi.exec(cb);
    });
  },
  getAllUsers : function(cb){
    redis.smembers('fgen:users', function(e, r){
      var multi = redis.multi();
      r.forEach(function(uid){
        multi.hgetall('fgen:u:'+uid);
      });
      multi.exec(cb);
    });
  },
  getAllUsersSlow : function(cb){
    redis.smembers('fgen:users', function(e, _users){
      var count = 0;
      var users = [];
      function userCb(uid){
        module.exports.getUser(uid, function(e, u){
          count+=1;
          if (!e && u){
            users.push(u);
          }
          if (count==_users.length){
            return cb(null, users);
          }
        });
      }
      _users.forEach(userCb);
    });
  },
  getAllCustomersSlow : function(cb){
    redis.smembers('fgen:customers', function(e, _users){
      var count = 0;
      var users = [];
      function userCb(uid){
        module.exports.getUser(uid, function(e, u){
          count+=1;
          if (!e && u){
            users.push(u);
          }
          if (count==_users.length){
            return cb(null, users);
          }
        });
      }
      _users.forEach(userCb);
    });
  },
  getAllCustomerIds : function(cb){
    redis.smembers('fgen:customers', cb);
  },
  getAllPremiumIds : function(cb){
    redis.smembers('fgen:premium', cb);
  },
  getAllUserIds : function(cb){
    redis.smembers('fgen:users', cb);
  },
  getAllDataUserIds : function(cb){
    redis.smembers('fgen:data_users', cb);
  }
};

