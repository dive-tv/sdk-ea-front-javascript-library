const fs = require('fs');
const path = require("path");
const express = require("express");
const request = require('request');
var proxy = require('express-http-proxy');
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV == "production";
console.log("SERVER is PRoduction?", isProduction, process.env.NODE_ENV);

const app = express(),
    DIST_DIR = path.join(__dirname, "dist"),
    PORT = 3000;

app.use(function (req, res, next) {
    console.log("USER AGEEEENT", req.get('User-Agent'));
    next();
});

app.head('*', function (req, res) {
    console.log(req.hostname);
    res.set("Content-Type", "application/vnd.hbbtv.xhtml+xml;charset=UTF-8");
    res.status(200).send("OK");
});

/*
app.use('/proxy', proxy('rest.dive.tv/v1/', {
    proxyReqPathResolver: function (req) {
        console.log("PROXYYYY ", req.url);
        const url = require('url').parse(req.url).path.split('v1/')[1];
        req.set("Access-Control-Allow-Origin", "http://localhost:3000");
        req.set("Origin", "http://localhost:3000");
        return url;
    },
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        data = JSON.parse(proxyResData.toString('utf8'));
        console.log("PROXXYYYY DATA", data);
        return JSON.stringify(data);
      }
}));
*/
app.use('/proxy', function (req, res) {
    req.pipe(request(req.url.split("url=")[1])).pipe(res);
});

if (!isProduction) {
    const webpack = require("webpack");
    const webpackConfig = require("./webpack.config.js");
    const compiler = webpack(webpackConfig);
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackDevOptions = {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        silent: true,
        stats: 'errors-only',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 50
        },
        headers: { "Access-Control-Allow-Origin": "*" }
    };
    webpackDevOptions.hot = webpackConfig.devServer.hot;
    app.use(webpackDevMiddleware(compiler, webpackDevOptions));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use("/", express.static(DIST_DIR));
}

app.listen(PORT, () => {
    console.log("Webpack dev server (Custom for HBBTV) listening on port", PORT);
    console.log("Waiting for webpack build");
}); 
