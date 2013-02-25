var dao = require('./dao.js');
function generate_xml_sitemap(users) {
  // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
  //var urls = ['about.html', 'javascript.html', 'css.html', 'html5.html'];
  // the root of your website - the protocol and the domain name with a trailing slash
  var root_path = 'http://www.followgen.com/stats/';
  // XML sitemap generation starts here
  var priority = 0.5;
  var freq = 'daily';
  var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (var i in users) {
      xml += '<url>';
      xml += '<loc>'+ root_path + users[i].screen_name.toLowerCase() + '</loc>';
      xml += '<changefreq>'+ freq +'</changefreq>';
      xml += '<priority>'+ priority +'</priority>';
      xml += '</url>';
      i++;
  }
  xml += '</urlset>';
  return xml;
}

module.exports = function(cb){
  dao.getAllUsers(function(e, users){
    return cb(e, generate_xml_sitemap(users));
  });
}
