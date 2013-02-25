module.exports = function(stats){

  var keys = Object.keys(stats);

  for (var i = 0;i<keys.length;i++){
    var key = keys[i];
    var key_future = keys[i+1];
    var key_past = keys[i-1];
    if (stats[key]===null && stats[key_future]!==null && stats[key_past]!==null){
      stats[key] = Math.ceil((stats[key_past]/1)+((stats[key_future]-stats[key_past])/2));
    }
  }
  return stats;
};