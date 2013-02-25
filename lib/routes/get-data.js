var get_route_files = require('./get-files.js');
module.exports = function(cb){
  var data = [];
  get_route_files(function(e, routes){
    routes.forEach(function(r){
      var path = r.split('.')[0];
      var method = r.split('.')[1];
      data.push([path, method]);
    });
    return cb(data);
  });
};
