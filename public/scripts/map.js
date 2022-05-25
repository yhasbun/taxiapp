var socket = io();
var map = L.map('MapID').setView({ lat: 11.008, lng: -74.809 });
map.setZoom(15);
var jaja = "1000";
let prev_placa;
let p1 = false;
let p2 = false;
// Icon options
var iconOptions = {
  iconUrl: 'logo1.png',
  iconSize: [50, 50]
}
// Creating a custom icon
var customIcon = L.icon(iconOptions);

// Creating Marker Options
var markerOptions = {
  title: "MyLocation",
  clickable: true,
  icon: customIcon
}
var iconOptions2 = {
  iconUrl: 'logo2.png',
  iconSize: [50, 50]
}
// Creating a custom icon
var customIcon2 = L.icon(iconOptions2);

// Creating Marker Options
var markerOptions2 = {
  title: "Carro 2",
  clickable: true,
  icon: customIcon2
}

// Creating a Marker
let marker = L.marker({ lat: 11.008, lng: -74.809 }, markerOptions).addTo(map);
let marker2 = L.marker({ lat: 11.008, lng: -75.809 }, markerOptions2).addTo(map);
/* let marker = L.marker({ lat: 11.008, lng: -74.809 },{ title: "Me" },{color:"#cf0404"}).addTo(map); */
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
let polyline2 = L.polyline([],{color: "#F7A52E", smoothFactor:3}).addTo(map);
const coords_records = [];
const coords_records2 = [];
latlng = [];
latlng2 = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function getGPS() {
    response = await fetch("http://taxilocationafb.ddns.net/gps");
    coordinates = await response.json();
    console.log(coordinates);
    coordinates2=coordinates;
    

    document.getElementById("LatID").textContent = coordinates.lat;
    document.getElementById("LongID").textContent = coordinates.lon;
    document.getElementById("FechaID").textContent = coordinates.date;
    document.getElementById("HoraID").textContent = coordinates.time;
    document.getElementById("RPMID").textContent = coordinates.rpm;
    document.getElementById("CARID").textContent = coordinates.carro;

    latlng = [parseFloat(info.lat) , parseFloat(info.lon)];
    latlng2 = [parseFloat(info.lat) , parseFloat(info.lon)];

    marker = L.marker(latlng, markerOptions).addTo(map);
    marker2 = L.marker(latlng2,markerOptions2).addTo(map);
    
    socket.on('change', function(info) {
        

      // Update HTML content.
      if (info.carro === '1') {
        document.getElementById("LatID").textContent = info.lat;
        document.getElementById("LongID").textContent = info.lon;
        document.getElementById("FechaID").textContent = info.date;
        document.getElementById("HoraID").textContent = info.time;
        document.getElementById("RPMID").textContent = info.rpm;
        document.getElementById("CARID").textContent = info.carro;
      }
      if (info.carro === '2') {
        document.getElementById("LatID2").textContent = info.lat;
        document.getElementById("LongID2").textContent = info.lon;
        document.getElementById("FechaID2").textContent = info.date;
        document.getElementById("HoraID2").textContent = info.time;
        document.getElementById("RPMID2").textContent = info.rpm;
        document.getElementById("CARID2").textContent = info.carro;
      }

      let placa = document.querySelector('').value; 

      if (prev_placa === undefined && placa === '2') {
        prev_placa = info.placa;
        prev_lat = parseFloat(info.latitud_text);
        prev_long = parseFloat(info.longitud_text);
    }            

    
    });
    
    map.removeLayer(marker);
    
    coords_records.push(latlng);
    coords_records2.push(latlng2);
    polyline.setLatLngs(coords_records);
    polyline2.setLatLngs(coords_records2);
}

setInterval(getGPS, 2000);
