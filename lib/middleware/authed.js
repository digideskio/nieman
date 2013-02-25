module.exports = function(req, res, next){
  // the callback should be the original path...(will it work on POST?)
  console.log(req.path);
  if (req.session && req.session.auth_data){
    return next();
  } else {
    res.redirect('/auth/'+req.owner.name+'?cb='+req.path);
  }
};
