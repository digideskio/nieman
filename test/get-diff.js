var getDiff = require('../lib/get-diff.js');

getDiff('232439599', 7, function(e, diff){
  console.log(e, diff);
});

