var http = require('http');
var braintree = require('braintree');
var fs = require('fs');
var version = JSON.parse(fs.readFileSync('package.json')).version;

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'fgnwmx3twfhjy224',
  publicKey: 'r5f3sxbcgks48jx4',
  privateKey: 'ff34bbd76b90603914f994c622e67bd9'
});

function cors (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control');
}

// Please do not write code like this!
//
// http.createServer((req, res) =>
//     cors(req, res) || req.url.indexOf('version') !== -1
//         ? res.writeHead(200, {'Content-Type': 'text/plain'}) || res.end(version)
//         : gateway.clientToken.generate({}, (err, _) => err
//             ? res.statusCode = 404 || res.end()
//             : res.writeHead(200, {'Content-Type': 'text/plain'}) || res.end(_.clientToken)
//         )
// ).listen(80);

http.createServer(function (req, res) {
    cors(req, res);
    if (req.url.indexOf('/version') !== -1) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(version);
    } else if (req.url.indexOf('/log?d=') !== -1) {
        log(req, req.url.split('/log?d=')[1]);
        res.writeHead(200);
        res.end();
    } else if (req.url.indexOf('/health') !== -1) {
        console.log('>   HEALTH CHECK (200)');
        res.writeHead(200);
        res.end();
    } else {
        gateway.clientToken.generate(function (err, success) {
            if (err) {
                res.statusCode = 404;
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(success.clientToken);
            }
        });
    }
}).listen(80);

function log (req, data) {
    if (console && console.log && req && data) {
        var info = {
            requestIP: req.connection.remoteAddress,
            requestHeaders: req.headers,
            paypalData: decodeURIComponent(data)
        };
        console.log('>   ' + JSON.stringify(info));
    }
}

