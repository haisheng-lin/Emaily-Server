var localtunnel = require('localtunnel');
localtunnel(5000, { subdomain: 'haishenglin' }, function(err, tunnel) {
  console.log('LT running');
});