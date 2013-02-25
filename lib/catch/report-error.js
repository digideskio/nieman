var report_error_email = require('../email/report-error-email.js');

module.exports = function(e){
  console.error('***********************');
  console.error(e);
  console.log(e.stack);
  console.error('***********************');
  if (process.env.NODE_ENV=='production') report_error_email(e);
};
