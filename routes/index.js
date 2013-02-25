var get_routes_data = require('../lib/routes/get-data.js');
exports.index = require(__dirname+'/splash/index.get.js');

module.exports = function(cb){
  get_routes_data(function(routes){
    routes.forEach(function(r){
      exports[r[0].replace('/','_')+'_'+r[1]] = require(__dirname+'/'+r[0]+'.'+r[1]+'.js');
    });
    return cb(exports);
  });
};

