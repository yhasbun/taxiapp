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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/gps', (req, res) => {
    res.json(coords);
})

//Esto es un comentario echo por Hollman
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
        console.log('message: ' + message)
        lat = String(message).substr(9, 10)
        lon = String(message).substr(30, 11)
        time = String(message).substr(53, 13)
        date = String(message).substr(41, 10)

        
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
