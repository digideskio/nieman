module.exports = function(targets){

  var formatted = [];

  targets.forEach(function(t){
    if (t.length){
      formatted.push(t.replace(/'/g,'\"'));
    }
  });

  return formatted;
};
