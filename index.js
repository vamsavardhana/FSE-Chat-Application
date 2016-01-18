/**
 * Created by anna on 1/16/16.
 */
var app = require('express')();
nicknames = [];
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/home',function(req,res){
   res.sendFile(__dirname+'/indextemp.html');
});


//app.get()
http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        //console.log(document.getElementById('name').getAttribute('value')+'message: ' + msg);
        console.log('message: ' + msg);require('util').log('Timestamped message.');
    });
});
/*io.emit('some event', { for: 'everyone' });

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});*/
///////////////////////////////////////
//////////////////////////////////////
io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if (nicknames.indexOf(data) != -1){
            callback(false);
        } else{
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
        }
    });

    function updateNicknames(){
        io.sockets.emit('usernames', nicknames);
    }

    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, nick: socket.nickname});
    });

    socket.on('disconnect', function(data){
        if(!socket.nickname) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames();
    });
});