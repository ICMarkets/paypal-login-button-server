var http = require('http');
var braintree = require('braintree');
var fs = require('fs');
var version = JSON.parse(fs.readFileSync('package.json')).version;

var gateway = braintree.connect({
  environment: braintree.Environment.Production,
  merchantId: 's72sbpq87tpptbv8',
  publicKey: 'r65gszk4p2j248zr',
  privateKey: '03251293bdede21fbfc7c0929af3758e'
});

function cors (req, res) {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': '86400', // 24 hours
        'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
        'Access-Control-Request-Method': req.method
    });
    res.end();
}

http.createServer((req, res) =>
    req.method === 'OPTIONS'
        ? cors(req, res)
        : req.url.indexOf('version') !== -1
            ? res.writeHead(200, {'Content-Type': 'text/plain'}) || res.end(version)
            : gateway.clientToken.generate({}, (err, _) => err
                ? res.statusCode = 404 || res.end()
                : res.writeHead(200, {'Content-Type': 'text/plain'}) || res.end(_.clientToken)
    )
).listen(80);
