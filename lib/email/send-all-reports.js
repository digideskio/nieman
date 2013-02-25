var util = require('util');
var dao = require('../dao');
var exec = require('child_process').exec;

var interval = 30*60*1000; //30mins
var USERS;
var BATCH_SIZE = 5;
var RUN_BATCH_INTERVAL = 1*1000;//1

function runBatch(){
  var users = USERS.splice(0, BATCH_SIZE);
  users.forEach(spawnChild);
}

function spawnChild(users){
  if (!users.length){
    console.log('**fin**');
    process.exit();
  }
  var user = users.shift();
  if (!user){
    console.error('no user!')
    return spawnChild(users);
  }
  function logData(data){
    util.log(user.screen_name+' '+data);
  }
  util.log('running '+user.screen_name);
  var node = process.env.NODE_ENV==='production' ? '/usr/local/bin/node' : 'node';
  var cmd = node+' '+__dirname+'/send-email-report.js '+user.id;
  var child = exec(cmd);
  child.stdout.on('data', logData);
  child.stderr.on('data', logData);
  child.on('exit', function(){
    util.log(user.screen_name+' exited');
    spawnChild(users);
  });
}

function run(){
  dao.getAllPremium(function(e, users){
    console.log(users.length);
    util.log('Starting '+users.length+' users');
    spawnChild(users);
  });
}

run();
