var map = L.map('MapID').setView({ lat: 11.008, lng: -74.809 });
map.setZoom(15);
var jaja = "1000";


// Icon options
var iconOptions = {
  iconUrl: 'logo1.png',
  iconSize: [50, 50]
}
// Creating a custom icon
var customIcon = L.icon(iconOptions);

// Creating Marker Options
var markerOptions = {
  title: "Carro 1 ",
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
let marker2 = L.marker({ lat: 11.908, lng: -75.809 }, markerOptions2).addTo(map);
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
    var nombredelmenu = document.querySelector('#nombredelmenu').value;
    console.log(nombredelmenu)
    response = await fetch("/gps");
    coordinates = await response.json();
    console.log(coordinates);
    coordinates2=coordinates;
   
   if(nombredelmenu == 'opcion3'){
    console.log("entro en carro 1y2")

   if(coordinates.carro=='carro: 1'){

    document.getElementById("LatID").textContent = coordinates.lat;
    document.getElementById("LongID").textContent = coordinates.lon;
    document.getElementById("FechaID").textContent = coordinates.date;
    document.getElementById("HoraID").textContent = coordinates.time;
    document.getElementById("RPMID").textContent = coordinates.rpm;
    document.getElementById("CARID").textContent = coordinates.carro;

   
    const latlng = [parseFloat(coordinates.lat) , parseFloat(coordinates.lon)];
    map.setView(latlng);
    map.removeLayer(marker);
    marker = L.marker(latlng, markerOptions).addTo(map);
    coords_records.push(latlng);
    polyline.setLatLngs(coords_records);

   }
   if(coordinates.carro=='carro: 2'){

    document.getElementById("LatID").textContent = coordinates2.lat;
    document.getElementById("LongID").textContent = coordinates2.lon;
    document.getElementById("FechaID").textContent = coordinates2.date;
    document.getElementById("HoraID").textContent = coordinates2.time;
    document.getElementById("RPMID").textContent = coordinates2.rpm;
    document.getElementById("CARID").textContent = coordinates2.carro;
   
    const latlng2 = [parseFloat(coordinates2.lat) , parseFloat(coordinates2.lon)];
    map.setView(latlng2);
    map.removeLayer(marker2);
    marker2 = L.marker(latlng2,markerOptions2).addTo(map);
    coords_records2.push(latlng2);
    polyline2.setLatLngs(coords_records2);

   }
   
  }else if(nombredelmenu == 'opcion1'){

    console.log("entro en carro 1");
    if(coordinates.carro=='carro: 1'){
     
    document.getElementById("LatID").textContent = coordinates.lat;
    document.getElementById("LongID").textContent = coordinates.lon;
    document.getElementById("FechaID").textContent = coordinates.date;
    document.getElementById("HoraID").textContent = coordinates.time;
    document.getElementById("RPMID").textContent = coordinates.rpm;
    document.getElementById("CARID").textContent = coordinates.carro;

   
    const latlng = [parseFloat(coordinates.lat) , parseFloat(coordinates.lon)];
    map.setView(latlng);
    marker = L.marker(latlng, markerOptions).addTo(map);
    coords_records.push(latlng);
    polyline.setLatLngs(coords_records);

    polyline2.removeFrom(map);
    map.removeLayer(marker2);
  
    }

  }else if(nombredelmenu == 'opcion2'){

    console.log("entro en carro 2");
    if(coordinates.carro=='carro: 2'){

    document.getElementById("LatID").textContent = coordinates2.lat;
    document.getElementById("LongID").textContent = coordinates2.lon;
    document.getElementById("FechaID").textContent = coordinates2.date;
    document.getElementById("HoraID").textContent = coordinates2.time;
    document.getElementById("RPMID").textContent = coordinates2.rpm;
    document.getElementById("CARID").textContent = coordinates2.carro;
   
    const latlng2 = [parseFloat(coordinates2.lat) , parseFloat(coordinates2.lon)];
    map.setView(latlng2);
    marker2 = L.marker(latlng2,markerOptions2).addTo(map);
    coords_records2.push(latlng2);
    polyline2.setLatLngs(coords_records2);

    polyline.removeFrom(map);
    map.removeLayer(marker1);

  }

  }
 
   
}

setInterval(getGPS, 2000);
