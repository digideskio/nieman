var fs = require('fs');
var async = require('async');
var path = __dirname+'/../../routes';

//TODO make this less retarded

module.exports = function(callback){
  var filenames = [];
  var file_fns = [];

  function readdir(dir){
    if(dir!=='index.js'){
      file_fns.push(function(cb){
        fs.readdir(path+'/'+dir, function(e, files){
          files.forEach(function(file){
            filenames.push(dir+'/'+file);  
          });
          cb();
        });
      });
    }
  }

  fs.readdir(path, function(e, dirs){
    dirs.forEach(readdir);
    async.series(file_fns, function(e){
      return callback(e, filenames);
    });
  });
};
