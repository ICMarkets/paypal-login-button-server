var fs = require('fs');
var http = require('http');
var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Production,
  merchantId: 's72sbpq87tpptbv8',
  publicKey: 'r65gszk4p2j248zr',
  privateKey: '03251293bdede21fbfc7c0929af3758e'
});

http.createServer((req, res) =>
    gateway.clientToken.generate({}, (err, _) => err
            ? res.statusCode = 404 || res.end()
            : res.writeHead(200, {'Content-Type': 'text/plain'}) || res.end(_.clientToken)
        )
    }
).listen(80);
