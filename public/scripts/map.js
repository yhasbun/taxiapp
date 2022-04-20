var map = L.map('MapID').setView({ lat: 11.008, lng: -74.809 });
map.setZoom(15);

let marker = L.marker({ lat: 11.008, lng: -74.809 },{ title: "Me" },{color:"#cf0404"}).addTo(map);
let polyline = L.polyline([], {color: '#41b611', smoothFactor:3}).addTo(map);
const coords_records = [];

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
    const latlng = [parseFloat(coordinates.lat) , parseFloat(coordinates.lon)];
    map.setView(latlng);
    map.removeLayer(marker);
    marker = L.marker(latlng).addTo(map);
    coords_records.push(latlng);
    polyline.setLatLngs(coords_records);
}

setInterval(getGPS, 5000);
