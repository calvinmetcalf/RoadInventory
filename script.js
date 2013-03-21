var m = L.map('map').setView([42.2, -71], 8)
var lc=L.control.layers.provided(['MapQuestOpen.OSM','Stamen.Watercolor',"OpenStreetMap.DE"]).addTo(m);
var stamenBase = L.layerGroup([
	L.tileLayer("http://{s}.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg",{minZoom:4,maxZoom:18}),
	L.tileLayer("http://{s}.tile.stamen.com/terrain-lines/{z}/{x}/{y}.png",{minZoom:4,maxZoom:18,attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
	]);
lc.addBaseLayer(stamenBase,"Stamen Baselayer");
stamenBase.addTo(m);
m.addHash({lc:lc});