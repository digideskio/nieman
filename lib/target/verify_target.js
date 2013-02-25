function isEmail(str){
  return (str.indexOf('@')!==-1 && str.indexOf('.')!==-1);
}

function hasNoCommas(targets){
  var has_no_commas = true;
  targets.forEach(function(t){
    if (t.indexOf(',')!==-1){
      has_no_commas = false;
    }
  });
  return has_no_commas;
}

function isValidBody(body){
  return (body.targets.length && body.geo && body.email && isEmail(body.email) && hasNoCommas(body.targets));
}

module.exports = function(req, res){
  return (isValidBody(req.body));
};
