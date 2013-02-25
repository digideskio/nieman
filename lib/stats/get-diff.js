var dao = require('../dao');

module.exports = function(data, numDays){
  var diff = {};
  var days = Object.keys(data);
  for (var i=0;i<days.length-1;i++){
    var today = data[days[i]];
    if (today!==null){
      var tmrw = data[days[i+1]];
      diff[days[i]] = tmrw-today;
    }
  }
  return diff;
}
