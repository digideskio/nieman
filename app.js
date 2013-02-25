var reportError = require('./lib/catch/report-error.js')
process.on('uncaughtException', reportError);

try {

  var port = process.argv[2];

  if (!port){
    console.error('SPECIFY PORT');
    process.exit();
  }

  if (!(process.env.NODE_ENV === 'development' || process.env.NODE_ENV==='production')){
    console.error('SPECIFY NODE ENV');
    process.exit();
  }

  var config = require('./lib/config')
  , authom = require('authom')
  , connect = require('connect')
  , RedisStore = require('connect-redis')(connect)
  , dao = require('./lib/dao')
  , express = require('express')
  , util = require('util')
  , middleware = require('./lib/middleware')
  , get_routes_data = require('./lib/routes/get-data.js')
  , fs = require('fs');

  // Configuration

  function configure_app(app, port, is_https){

    app.configure(function(){
      app.set('views', __dirname + '/views');
      app.set('view engine', 'ejs');
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.cookieParser());
      app.use(express.session({secret: "brandbrandbrand", store: new RedisStore}));
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));
    });

    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
      app.use(express.errorHandler());
    });


    require('./routes')(function(router){

      get_routes_data(function(routes){

        app.get('/', function(req, res){
          router.index(req, res);
        });

        routes.forEach(function(r){
          console.log(r[1], '/'+r[0].replace('/index', ''), r[0].replace('/','_')+'_'+r[1]);
          var rname = r[0].replace('/','_')+'_'+r[1]
          app[r[1]]('/'+r[0].replace('/index', ''), router[rname]);
        });

          app.listen(port, function(){
            console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
          });

        });

      });

  }


  var app_http = module.exports = express.createServer();

  configure_app(app_http, port, false);

} catch (e) {
  reportError(e);
}
