var fs = require('fs');
var data = fs.readFileSync('./steph_data.txt', 'utf8');
var rides = data.split('\n');
var _base_rate = 125;
var _num_bikes = 47;
var _tax_rate_compliment = (100-33.17)/100;

var get_bonus = function(num_customers, total_customers){
  var bonus = 0;
  var pct_full = (num_customers/47)*100;

  if (pct_full >= 25){
    bonus = 35;
  }

  if (pct_full >= 50){
    bonus = 75;
  }

  if (pct_full >= 75){
    bonus = 110;
  }

  if (pct_full >= 100){
    bonus = 150;
  }

  if (isNaN(pct_full)){
    bonus = 75;
  }

  console.log(total_customers, num_customers, pct_full.toFixed(2), bonus);
  return bonus;

}

var total = 0;

var total_pay = 0;

rides.forEach(function(ride){
  var ride = ride.split('\t');
  var customers = ride[5];
  var pay = _base_rate+get_bonus(customers/1, ride[4]);
  total_pay += pay;
});

console.log(total_pay, rides.length, 'rides');
