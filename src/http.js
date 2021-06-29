const express = require('express');
const { createServer } = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('express-async-errors');

const { router } = require('./routes');

const userSocket = require('./websockets/user');

require('./database/connection');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const http = createServer(app);
const io = new Server(http);

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        
    });

})

global.io = io;

userSocket();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
    if(err instanceof Error){
        return res.status(400).json({ error: err.message })
    }

    return res.status(500).json({ status: 'erorr', message: 'Internal Server Error' })
})

module.exports = { http };