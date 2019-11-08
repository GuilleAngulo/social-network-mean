'use strict';

module.exports = function(io){
    
    var messages = [];
    var online = 0;

    io.on('connection', function(socket){

        console.log("IP: " + socket.handshake.address + 
                   " has connected | Time: " + socket.handshake.time);

        online = online + 1;
        io.sockets.emit('users', online);

        socket.on('add-message', function(data){
            messages.push(data); 
            io.sockets.emit('messages', messages);
        });

        socket.on('disconnection', function(data){
            online = online -1;
            messages.push(data); 
            io.sockets.emit("usuarios", online)
            io.sockets.emit('messages', messages);
            socket.disconnect();
            console.log("IP: " + socket.handshake.address + 
                   " has disconnected | Time: " + socket.handshake.time);
        });

    });
}


