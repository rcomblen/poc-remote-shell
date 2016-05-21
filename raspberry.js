(function() {
    'use strict';
    var socket = require('socket.io-client')('http://localhost:8080');
    var pty = require('pty.js');

    var Console = require('console').Console;
    var logger = new Console(process.stdout, process.stderr);


    socket.on('connect', function() {
        logger.log('connected');
        socket.emit('rasp_connected');
        socket.on('browser_connected', function(){
            var buff = [];
            var term = pty.fork(
                '/bin/bash',
                [
                ],
                {
                    name: 'xterm',
                    cols: 160,
                    rows: 40
                }
            );
            socket.emit('rasp_ready');

            term.on('data', function(data) {
                return !socket              ?
              buff.push(data)
                  : socket.emit('from_rasp_data', data);
            });

            socket.on('from_browser_data', function(data) {
                term.write(data);
            });

            while (buff.length) {
                socket.emit('from_rasp_data', buff.shift());
            }
        });
    });
}());

