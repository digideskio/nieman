require 'redis'

def get_key(uid)
  return 'fgen:u:'+uid
end

def get_user(uid)
  return $redis.hgetall(get_key(uid))
end

def get_score(user)
  return user['friends_count'].to_i===0 ? user['followers_count'].to_i : (user['followers_count'].to_i / user['friends_count'].to_i) * user['followers_count'].to_i
end

score_map = {}
score_array = []
$redis = Redis.new(:driver => :hiredis)
user_ids = $redis.smembers('fgen:users')
user_ids.each do |uid, i|
  user = get_user(uid)
  score = get_score(user)
  #score_map[score.to_s] = score_map[score.to_s] ? score_map[score.to_s]+1 : 1;
  score_array.push(score)
end
puts score_array.max
