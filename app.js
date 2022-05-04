const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const dgram = require('dgram');
const path = require("path");
const socket = dgram.createSocket('udp4');
const config = require('dotenv').config();
const mysql = require('mysql');


var PORT = process.env.PORT;
var PORT_UDP = process.env.PORT_UDP;
var lat = '';
var lon = '';
var date = '';
var time = '';
var rpm = '';
var carro = '';
var coords;

app.use(express.static(__dirname +"/public"));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/historicos", function (req, res) {
    res.sendFile(path.join(__dirname + "/historicos.html"));
});
app.get("/buzon", function (req, res) {
    res.sendFile(path.join(__dirname + "/buzon.html"));
});
app.get("/logo1.png", function (req, res) {
    res.sendFile(path.join(__dirname + "/logo1.png"));
});
app.get("/logo2.png", function (req, res) {
    res.sendFile(path.join(__dirname + "/logo2.png"));
});


app.get('/gps', (req, res) => {
    res.json(coords);
})

app.post('/historic', (req, res) => {
    console.log(req.body);
    const { fecha_inicio, hora_inicio, fecha_fin, hora_fin } = req.body;

    const sql_query = `SELECT * 
    FROM datos 
    WHERE 
    str_to_date(concat(fecha, 'T', hora), '%Y/%m/%dT%H:%i:%s') >= str_to_date(concat('${fecha_inicio}', 'T', '${hora_inicio}'),'%Y/%m/%dT%H:%i:%s')
    AND str_to_date(concat(fecha, 'T', hora), '%Y/%m/%dT%H:%i:%s') <= str_to_date(concat('${fecha_fin}', 'T', '${hora_fin}'),'%Y/%m/%dT%H:%i:%s');`

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

    con.query(sql_query, (err, info) => {
        if (err) {
            console.log("No se pudo ejecutar el query.");
            return;
        }
        console.log("Datos recibidos con éxito.");
        con.end();
        res.json({data: info});
    });
});

server.listen(PORT, function () {
    console.log(`Servidor iniciado en el puerto ${PORT}`);

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
            time: time,
            rpm: rpm,
            carro:carro
        }

        var mysql = "INSERT INTO datos (Latitud, Longitud, Fecha, Hora, rpm,carro ) VALUES ?";
        var values = [[lat, lon, date, time, rpm, carro],];
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
