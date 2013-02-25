function getAvgDayGainMap(series){
  var map = {};
  var _sum = 0;
  var _count = 0;
  for (var i=0; i<7; i++){
    var count = 0;
    var sum = 0;
    Object.keys(series).forEach(function(d){
      if (series[d]===null) return;
      var day = new Date(d/1).getDay();
      if (day!==i) return;
      _sum+=series[d];
      _count+=1;
      sum+=series[d];
      count+=1;
    });
    map[i.toString()] = sum/count;
  }
  map.total = _sum/_count;
  return map;
}

function forecastSeries(series, map, days){
  for (var i=0; i<days; i++){
    var last_history_key = Object.keys(series)[Object.keys(series).length-1];
    var new_day_key = (last_history_key/1)+(24*60*60*1000);
    var day = new Date(new_day_key).getDay();
    var gain_day = day ? day-1 : 6;    
    series[new_day_key] = series[last_history_key]/1 + map[gain_day]/1;
  }
  return series;
}

function pruneNaNs(series){
  Object.keys(series).forEach(function(ts){
    
    if (isNaN(series[ts])){
      delete series[ts];
    }
  });
  return series;
}

function getLastHistoryKey(series){
  for (var i=Object.keys(series).length-1; i>-1; i--){
    if (series[Object.keys(series)[i]]){
      return Object.keys(series)[i];
    }
  }
}

module.exports = function(history_series, history_diff, days){
  history_series = pruneNaNs(history_series);
  history_diff = pruneNaNs(history_diff);
  var last_history_key = getLastHistoryKey(history_series);
  var map = getAvgDayGainMap(history_diff);
  var future_series = {};
  future_series[last_history_key] = history_series[last_history_key];
  return forecastSeries(future_series, map, days);
};
