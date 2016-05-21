(function() {
    'use strict';
    var http = require('http');
    var express = require('express');
    var io = require('socket.io');
    var pty = require('pty.js');
    var terminal = require('term.js');

    var Console = require('console').Console;
    var logger = new Console(process.stdout, process.stderr);

    var app = express();
    var server = http.createServer(app);
    /*jslint unparam: true*/
    app.use(function(req, res, next) {
        var setHeader = res.setHeader;
        res.setHeader = function(name) {
            switch (name) {
                case 'Cache-Control':
                case 'Last-Modified':
                case 'ETag':
                    return;
            }
            return setHeader.apply(res, arguments);
        };
        next();
    });
    /*jslint unparam: false*/

    app.use(terminal.middleware({path: '/term/term.js'}));
    app.use(express.static(__dirname + '/static/'));

    server.listen(8080);

    io = io.listen(server, {
        log: false
    });

    var browser = {
        sock: null
    };
    var rasp = {
        socke: null
    };

    io.sockets.on('connection', function(sock) {
        sock.on('browser_connected', function(data) {
            if(browser.sock == null) {
                browser.sock = sock;
                browser.sock.on('from_browser_data', function(data) {
                    rasp.sock.emit('from_browser_data', data);
                });
                rasp.sock.emit('browser_connected');
            }
        });
        sock.on('rasp_connected', function(data) {
            logger.log('rasp_connected');
            rasp.sock = sock;
            rasp.sock.on('from_rasp_data', function(data) {
                browser.sock.emit('from_rasp_data', data);
            });
        });

    });
}());

