var http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    requireDir = require('require-dir');
    app = express();
    cfenv = require('cfenv');
    appEnv = cfenv.getAppEnv();



app.set('port', process.env.PORT || 3001);
app.use(bodyParser());

app.use(express.static(path.join(__dirname, './public')));

app.get('/', function (req, res) {
     res.json({title: 'hey', message: 'Hello there'});
});

app.post('/', function(req, res) {
    console.log("Post !!");
});

var routes = requireDir('./routes');

// public routes
for(let route in routes) {
    app.use('/' + route.replace(/.route$/, ''), routes[route].publicRoutes());
}
// private routes
/* for(let route in routes) {
    app.use('/' + route.replace(/.route$/, ''), routes[route].privateRoutes());
} */

app.use(cors({
    origin : "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'X-Access-Token']
}));



module.exports = {
    express: app,
    appEnv : appEnv
};
