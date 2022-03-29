const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const dgram = require('dgram');
const path = require("path");
const socket = dgram.createSocket('udp4');
const config = require('dotenv').config();


var PORT = process.env.PORT;
var PORT_UDP = process.env.PORT_UDP;
var lat = '';
var lon = '';
var date = '';
var time = '';
var coords;

app.use(express.static(__dirname + '/public/'));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/gps', (req, res) => {
    res.json(coords);
})

server.listen(PORT, function () {
    console.log(`Servidor iniciado en el puerto ${PORT}`);

    const mysql = require('mysql');

    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    con.connect((err) => {
        if (err) {
            console.error('error conecting: ' + err.stack);
            return;
        }
        else {
            console.log("Connected to database.");
        }
    });

    console.log('Sniffer on port', PORT_UDP);

    socket.on('message', (message) => {
        console.log('message splited: ' + String(message).split('\n'))
        const msg_values = String(message).split('\n');
        lat = msg_values[0].split(':')[1].trim()
        lon = msg_values[1].split(':')[1].trim()
        date = msg_values[2].split(',')[0].trim()
        time = msg_values[2].split(',')[1].trim()
        
        coords = {
            lat: lat,
            lon: lon,
            date: date,
            time: time
        }

        var mysql = "INSERT INTO datos (Latitud, Longitud, Fecha, Hora) VALUES ?";
        var values = [[lat, lon, date, time],];
        con.query(mysql, [values], function (err) {
            if (err) throw err;
            console.log("1 record inserted");
        });

    });

    socket.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        udp_server.close();
    });

    socket.bind({
        addres: process.env.HOST,
        port: PORT_UDP
    });
});
