/*
const express = require('express');
var morgan = require('morgan');
// const logger = require('./logger');
// const fs = require('fs');

// const argv = require('minimist')(process.argv.slice(2));
// const setup = require('./middlewares/frontendMiddleware');
// const isDev = process.env.NODE_ENV !== 'production';
// const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
// const resolve = require('path').resolve;
const app = express();
app.use(morgan('combined'));
app.head('*', function(req, res) {
    //console.log("REQUEST", req);
    res.set("Server", "Apache-Coyote/1.1")
    res.set("Content-Type", "application/vnd.hbbtv.xhtml+xml;charset=UTF-8");
    res.set("Content-Language", "es-ES");
    res.set("Cache-Control", "max-age=22");
    res.set("Expires", "Mon, 18 Sep 2017 08:36:56 GMT");
    res.set("Date", Date.now());
    res.set("Content-Length", "0");
    res.set("Connection", "keep-alive");
    res.set("X-N", "S");
    res.status(200).send("OK");
    console.log("RESPONSE", res);
});
app.get('*', express.static('dist/tizen'));


app.listen(3000);
*/
const fs = require('fs');
const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js");

const app = express(),
    DIST_DIR = path.join(__dirname, "dist", "tizen"),
    PORT = 3000,
    compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: DIST_DIR
}));

app.head('*', function (req, res) {
    console.log(req.host);
    res.set("Content-Type", "application/vnd.hbbtv.xhtml+xml;charset=UTF-8");
    res.status(200).send("OK");
});

app.use("/", express.static(DIST_DIR));

/*
app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
        if (err) {
            res.sendStatus(404);
        } else {
            res.send(file.toString());
        }
    });
});
*/
app.listen(PORT); 
