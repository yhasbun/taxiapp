import L from "leaflet";
import AwesomeMarkers from "leaflet.awesome-markers";

var map = L.map("map").setView([-31.6333294, -60.6900008], 12);
var marcadorEscuelas = L.AwesomeMarkers.icon({
  icon: "fa-university",
  prefix: "fa",
  markerColor: "blue",
  iconColor: "black"
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 18
}).addTo(map);

L.marker([-31.6333294, -60.6900008], { icon: marcadorEscuelas }).addTo(map);
