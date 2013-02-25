var dao = require('../dao');

module.exports = function(folls){

  var start, end;
  var days = 0;
  var len = Object.keys(folls).length;

  for (var i=0;i<len;i++){
    var key = Object.keys(folls)[i];
    if (folls[key]) {
      start = folls[key];
      break;
    }
  }

  for (var i=len;i>-1;i--){
    var key = Object.keys(folls)[i];
    if (folls[key]) {
      end = folls[key];
      break;
    }
  }

  var days = 0;
  for (var i=len;i>-1;i--){
    var key = Object.keys(folls)[i];
    if (folls[key]) {
      days+=1;
    }
  }
  return {end:end, start:start, gain:end-start, days:days, velocity:Math.ceil((end-start)/(days-1))};
};
