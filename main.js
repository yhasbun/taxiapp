const express = require('express')
const app = express();
const dgram = require('dgram');
const path = require("path");
const socket = dgram.createSocket('udp4');
const config = require('dotenv').config();
var port = process.env.PORT;

var portUdp = 3020;

var lat = ''
var lon = ''
var date = ''
var time = ''


// settings

const mysql = require('mysql')

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

con.connect((err) => {
    if (err) {
        console.error('error conecting: ' + err.stack);
        return;
    }
    else {
        console.log("Connected to Data base")

    }
});


//listening the server
function main() {
    console.log('aqui va bien');
    //routes
    app.get("/", (req, res) => {

        res.sendFile(path.join(__dirname + "/index.html"));
    });



    console.log('Sniffer on port', portUdp);
    socket.on('message', (message) => {

        console.log('message: ' + message)
        lat = String(message).substr(9, 10)
        lon = String(message).substr(30, 11)
        time = String(message).substr(53, 13)
        date = String(message).substr(41, 10)

        var mysql = "INSERT INTO datos (Latitud, Longitud, Fecha, Hora) VALUES ?";
        var values = [
            [lat, lon, date, time],
        ];
        con.query(mysql, [values], function (err) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        socket.bind(portUdp)
    });

    app.get('/gps', (req, res) => {
        res.json(
            {
                lat: lat,
                lon: lon,
                date: date,
                time: time
            }
        );
    })

}

main();

