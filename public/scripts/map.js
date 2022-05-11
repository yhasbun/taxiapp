const { response } = require("express");

var map = L.map('MapID').setView({ lat: 11.008, lng: -74.809 });
map.setZoom(15);

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
// Creating a Marker
let marker = L.marker({ lat: 11.008, lng: -74.809 }, markerOptions).addTo(map);
let marker2 = L.marker({ lat: 11.008, lng: -75.809 }, markerOptions).addTo(map);
/* let marker = L.marker({ lat: 11.008, lng: -74.809 },{ title: "Me" },{color:"#cf0404"}).addTo(map); */
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
const coords_records = [];
const coords_records2 = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function getGPS() {
    response = await fetch("http://taxilocationafb.ddns.net/gps");
    coordinates = await response.json();
    console.log(coordinates);
    document.getElementById("LatID").textContent = coordinates.lat;
    document.getElementById("LongID").textContent = coordinates.lon;
    document.getElementById("FechaID").textContent = coordinates.date;
    document.getElementById("HoraID").textContent = coordinates.time;
    document.getElementById("RPMID").textContent = coordinates.rpm;
    document.getElementById("CARID").textContent = coordinates.carro;
    if(parseFloat(coordinates.carro=="1")){

      const latlng = [parseFloat(coordinates.lat) , parseFloat(coordinates.lon)];
      map.setView(latlng);}
    
  
//////////
    coordinates2 = await response.json();
    console.log(coordinates2);
    document.getElementById("LatID").textContent = coordinates2.lat;
    document.getElementById("LongID").textContent = coordinates2.lon;
    document.getElementById("FechaID").textContent = coordinates2.date;
    document.getElementById("HoraID").textContent = coordinates2.time;
    document.getElementById("RPMID").textContent = coordinates2.rpm;
    document.getElementById("CARID").textContent = coordinates2.carro;

    if(parseFloat(coordinates2.carro=="2")){

    const latlng2 = [parseFloat(coordinates.lat) , parseFloat(coordinates.lon)];
    map.setView(latlng2);}
    
    
    ////
    map.removeLayer(marker);
    marker = L.marker(latlng, markerOptions).addTo(map);
    marker2 = L.marker(latlng2,markerOptions).addTo(map);
    coords_records.push(latlng);
    coords_records2.pish(latlng2);
    polyline.setLatLngs(coords_records);
}

setInterval(getGPS, 2000);
