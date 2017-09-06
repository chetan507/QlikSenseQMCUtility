var path = require('path');
var fs = require('fs');
var extend = require('extend');
var installConfig;
var testConfig;

var configPath = path.join(__dirname, '/../config/');
var dir = fs.readdirSync(configPath);
dir.forEach(function (file) {
    if (file === 'installConfig.js') {
        installConfig = require('./installConfig');
    }

    // if (file === 'testConfig.js') {
    //     testConfig = require('./testConfig');
    // }
})



var certPath = "";

var logPath = path.join(__dirname, '/../log/');
var logFile = logPath + 'QMCUtilities.log';

var globalHostname = "localhost";
var friendlyHostname;
var qrsHostname;
var certPathBackup;
var qsocksHostname;
if (process.platform == "darwin") {
    certPath = path.join(process.env.HOME, '/Documents/Certificates/');
} else {
    if (certPathBackup !== undefined) {
        certPath = certPathBackup;
    } else {
        certPath = path.join(process.env.programdata, '/Qlik/Sense/Repository/Exported Certificates/.Local Certificates');
    }
}


var config = {
    certificates: {
        certPath: certPath,
        client: path.resolve(certPath, 'client.pem'),
        client_key: path.resolve(certPath, 'client_key.pem'),
        server: path.resolve(certPath, 'server.pem'),
        server_key: path.resolve(certPath, 'server_key.pem'),
        root: path.resolve(certPath, 'root.pem')
    },
    logging: {
        logPath: logPath,
        logFile: logFile,
        logLevel: 'info'
    },
    thisServer: {
        devMode: false,
        port: 9945,
        hostname: friendlyHostname !== undefined ? friendlyHostname : globalHostname,
        routePath: path.join(__dirname, '/../routes/'),
        publicPath: path.join(__dirname, '/../public/'),
        bowerPath: path.join(__dirname, '/../bower_components/'),
        nodeModulesPath: path.join(__dirname, '/../node_modules/'),
        dataPath: path.join(__dirname, '/../data/'),
        appPath: path.join(__dirname, '/../app/'),
        pluginPath: path.join(__dirname, '/../plugins/')
    },
    qsocks: {
        host: qsocksHostname !== undefined ? qsocksHostname : globalHostname,
        port: 4747,
        isSecure: true,
        origin: "https://" + (qsocksHostname !== undefined ? qsocksHostname : globalHostname),
        rejectUnauthorized: false
    },
    engine: {
        hostname: qsocksHostname !== undefined ? qsocksHostname : globalHostname,
        port: 4747,
        userDirectory: "INTERNAL",
        userId: "sa_repository"
    },
    qrs: {
        hostname: qrsHostname !== undefined ? qrsHostname : globalHostname
    },
    version: "3.1.0"
}


if (friendlyHostname !== undefined || qrsHostname !== undefined || certPathBackup !== undefined) {
    var mergedConfig = config;
} else if (installConfig !== undefined) {
    var mergedConfig = extend(true, config, installConfig);
} else if (testConfig !== undefined) {
    var mergedConfig = extend(true, config, testConfig);
} else {
    var mergedConfig = config;
}

module.exports = mergedConfig;