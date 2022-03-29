var map = L.map('MapID').setView({ lat: 11.008, lng: -74.809 });
map.setZoom(13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function getGPS() {
    response = await fetch("http://taxiapp.ddns.net:3900/gps");
    coordinates = await response.json();
    console.log(coordinates);
    document.getElementById("LatID").textContent = coordinates.lat;
    document.getElementById("LongID").textContent = coordinates.lon;
    document.getElementById("FechaID").textContent = coordinates.date;
    document.getElementById("HoraID").textContent = coordinates.time;
    const latlng = [parseFloat(coordinates.lat) , parseFloat(coordinates.lon)]
    var marker = L.marker(latlng).addTo(map);
    map.setView(latlng);
}

setInterval(getGPS, 1000);