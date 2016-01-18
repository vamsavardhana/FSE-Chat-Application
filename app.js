var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    nicknames = [];

var sqlite3 = require('sqlite3').verbose();
 var db = new sqlite3.Database('cozy.db');


server.listen(3000);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/exit', function(req, res){
    console.log(" i came to exit");
    res.sendfile(__dirname + '/exit.html');
});

io.sockets.on('connection', function(socket) {
    db.serialize(function () {

        db.run("CREATE TABLE if not exists user_info (info TEXT)");

    });
    console.log("Server started and table created");
    //db.close();


    socket.on('new user', function (data, callback) {

        console.log(" New user joined the chat");
        //var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");

        if (nicknames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
            db.each("SELECT name,msg,time info from user_info limit 5", function(err, row) {
                console.log(row);
                io.sockets.emit('new message', row);

             });
        }




});
    function updateNicknames(){
        console.log("<displaying user names");
        io.sockets.emit('usernames', nicknames);
    }

    socket.on('send message', function(datax){
        console.log("<this is the data"+ datax);
        var stmt = db.prepare("INSERT INTO user_info VALUES (?,?,?)");
        stmt.run(socket.nickname,datax.msg,datax.time);
        stmt.finalize();
       /* db.each("SELECT rowid AS id, info from user_info", function(err, row) {
            console.log(row.id + ": " + row.info);*/
       /* });*/
    console.log(" Inside this msg");
        var data = {
            "name" :socket.nickname,
            "msg" : datax.msg,
            "info" :datax.time
        }
        io.sockets.emit('new message', data);
        console.log(" Inside this msg twice");
    });


});