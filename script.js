var m = L.map('map').setView([42.2, -71], 8),
    r=L.tileLayer("//services.massdot.state.ma.us/ArcGIS/rest/services/RoadInventory/Roads/MapServer/tile/{z}/{y}/{x}",{attribution: 'Road Tiles from <a href="http://www.massdot.state.ma.us/planning/Main.aspx" target="_blank">MassDOT Planning</a>'}).addTo(m),
    t=L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});
    var mapQuestAttr = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ';
var osmDataAttr = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var mopt = {
    url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpeg',
    options: {attribution:mapQuestAttr + osmDataAttr, subdomains:'1234'}
  };
var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:osmDataAttr});
var stamen={atribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'};
stamen.background = L.tileLayer("http://{s}.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg",{attribution:stamen.atribution}).addTo(m);
stamen.waterColor = L.tileLayer("http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",{attribution:stamen.atribution});
var osmDE = L.tileLayer(
    'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',{
        attribution: '&copy <a href=" http://www.openstreetmap.org/" title="OpenStreetMap">OpenStreetMap</a>  and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" title="CC-BY-SA">CC-BY-SA</a>',
        maxZoom: 18,
        subdomains: 'abc'
    }
);
var cloudmade = {url : "http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/1/256/{z}/{x}/{y}.png"};
cloudmade.orig= L.tileLayer(cloudmade.url);
var mq=L.tileLayer(mopt.url,mopt.options);
    var baseMaps = {
    "Map Quest": mq,
    "Open Street Map":osm,
    "Open Street Map DE" : osmDE,
  "ESRI":t,
  "Terrain":stamen.background,
  "Water Color":stamen.waterColor,
  "Cloud Made":cloudmade.orig
};

var overlayMaps = {
 "Roads":r
};
var lc=L.control.layers(baseMaps, overlayMaps);
lc.addTo(m);
var h = L.hash(m,lc);