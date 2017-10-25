const fs = require('fs');
const path = require("path");
const express = require("express");
const request = require('request');
var proxy = require('express-http-proxy');
const webpack = require("webpack");
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV == "production";
console.log("SERVER is PRoduction?", isProduction, process.env.NODE_ENV);

var os = require('os');
var ifaces = os.networkInterfaces();
var localIp = '';

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
        }
        if (ifname == 'en0' || ifname == 'Ethernet') {
            localIp = iface.address;
        }
        ++alias;
    });
});

const app = express(),
    DIST_DIR = path.join(__dirname, "dist"),
    PORT = 3000;
app.use('/__webpack_hmr', function (req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.set("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
    next();
});

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
const webpackConfig = require("./webpack.config.js");
webpackConfig.output.publicPath = `http://${localIp}:${PORT}/`;

if (!isProduction) {
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
    app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        // dynamicPublicPath: true,
        // path: `/__webpack_hmr`,
        // heartbeat: 10 * 1000,
    }));
    console.log("WEBPACK DEV AND HOT");
} else {
    webpack(webpackConfig, function (err, stats) {
        console.log("Webpack ended compilation, serving static files");
        console.log("ERRORS", stats.hasErrors(), err);
        if (stats.hasErrors() || err) {
            console.log("Error report: ", stats.toString('errors-only'));
        }
        app.use("/", express.static(DIST_DIR));
    });

}

app.listen(PORT, () => {
    console.log(`Webpack dev server (Custom for HBBTV) listening on ${localIp}:${PORT}`);
    console.log("Waiting for webpack build");
}); 
