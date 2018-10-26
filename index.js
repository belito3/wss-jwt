var fs = require('fs');
var https = require('https');
var jwt = require('jsonwebtoken');
var config = require('./config');

var privateKey  = fs.readFileSync('sslcert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/fullchain.pem', 'utf8');
 
var credentials = {key: privateKey, 
                    cert: certificate};

 
//... bunch of other express stuff here ...

//pass in your express app and credentials to create an https server
var httpsServer = https.createServer(credentials);

httpsServer.on('request', (req, res) => {
    res.writeHead(200);
    res.end('Wellcome to troidat.com\n');
});

httpsServer.listen(config.PORT);

var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
        server: httpsServer,
        // middleware vertify jwt
        verifyClient: (info, cb) => {
            let token = info.req.headers.token;
            if(!token){
                cb(false,401,'Unauthorized');
            } else {
                jwt.verify(token, config.JWT_SECRETKEY, (err, decoded) => {
                    if(err){
                        cb(false, 401, 'Unauthorized');
                    } else {
                        info.req.user = decoded;
                        cb(true);
                    }
                })
            }
        }
});

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    });

    ws.send('messeage from server');
});

