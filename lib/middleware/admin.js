module.exports = function(req, res, next){
  if (req.user.screen_name === 'recborg'){
    next();
  } else {
    res.redirect('/');
  }
};
