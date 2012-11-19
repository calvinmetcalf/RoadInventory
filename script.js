function toGeoJSON(k,l){function m(a){if(1===a.rings.length)return{type:"Polygon",coordinates:a.rings};var b,a=a.rings;b=[];for(var c=[],e=a.length,g=0;e>g;){for(var h=a[g],i=h.length-1,f=0,d=0;i>f;)d+=h[f][0]*h[f+1][1]-h[f+1][0]*h[f][1],f++;0>=d?b.push(a[g]):c.push(a[g]);g++}b=[b,c];a=b[0];c=b[1];b=[];if(0===c.length){for(c=a.length;0<c;)b.push([a[0]]);return{type:"MultiPolygon",coordinates:b}}return 1===a.length?(c.unshift(a[0]),{type:"Polygon",coordinates:c}):{type:"MultiPolygon",coordinates:a,
holes:c}}for(var i={type:"FeatureCollection",features:[]},n=k.features.length,d=0;n>d;){var a=k.features[d],e={type:"Feature",properties:a.attributes};if(a.geometry.x)e.geometry={type:"Point",coordinates:[a.geometry.x,a.geometry.y]};else if(a.geometry.points){var j=e;a=a.geometry;a=1===a.points.length?{type:"Point",coordinates:a.points[0]}:{type:"MultiPoint",coordinates:a.points};j.geometry=a}else a.geometry.paths?(j=e,a=a.geometry,a=1===a.paths.length?{type:"LineString",coordinates:a.paths[0]}:{type:"MultiLineString",
coordinates:a.paths},j.geometry=a):a.geometry.rings&&(e.geometry=m(a.geometry));i.features.push(e);d++}if(l)l(i);else return i};
L.Util.jsonp = function (url, cb, cbParam, callbackName){
    var cbn,ourl,cbs;
    var cbParam = cbParam || "callback";
    if(callbackName){
        cbn= callbackName;
    }else{
        cbs = "_" + Math.floor(Math.random()*1000000);
        cbn = "L.Util.jsonp.cb." + cbs;
    }
    
    L.Util.jsonp.cb[cbs] = cb;
    var scriptNode = L.DomUtil.create('script','', document.getElementsByTagName('body')[0] );
    scriptNode.type = 'text/javascript';
    if (url.indexOf("?") === -1 ){
        ourl =  url+"?"+cbParam+"="+cbn;
    }else{
        ourl =  url+"&"+cbParam+"="+cbn;
    }
    scriptNode.src = ourl;   
};
L.Util.jsonp.cb = {};
var m = L.map('map').setView([42.2, -71], 8),
	popUp,
    h = new L.Hash(m),
    r=L.tileLayer("http://services.massdot.state.ma.us/ArcGIS/rest/services/RoadInventory/Roads/MapServer/tile/{z}/{y}/{x}",{attribution: 'Road Tiles from <a href="http://www.massdot.state.ma.us/planning/Main.aspx" target="_blank">MassDOT Planning</a>'}).addTo(m),
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
var cloudmade = {url : "http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/1/256/{z}/{x}/{y}.png"};
cloudmade.orig= L.tileLayer(cloudmade.url);
var mq=L.tileLayer(mopt.url,mopt.options);
    var baseMaps = {
    "Map Quest": mq,
    "Open Street Map":osm,
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
var clickable = L.geoJson("",{style:{opacity:0}}).addTo(m)
clickable.on("click", getInfo);
function getInfo(e){
    function getLayer(z){
     return (z-4)*2;   
    }
    var zoom = m.getZoom();
    var latlng = e.latlng;
    var lat = latlng.lat;
    var lng = latlng.lng;
    var urlT = "http://services.massdot.state.ma.us/ArcGIS/rest/services/RoadInventory/Roads/MapServer/{layer}/query?geometry={lng}%2C{lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIndexIntersects&returnGeometry=false&outSR=4326&outFields=Jurisdiction,StreetName,FunctionalClassification&f=json";
	var urlOpt = {layer: getLayer(zoom), lng: lng, lat: lat};
	var url = L.Util.template(urlT, urlOpt);
	L.Util.jsonp(url,function (data){
		var out = [];
		for(var i in data.features){
			var streetName = data.features[i].attributes.StreetName;
			if(out.indexOf(streetName)===-1){
				out.push(streetName);
			}
		}
		var popUpcontent = L.Util.template("<div><ol><li>{el}</li></ol></div>",{el: out.join("</li><li>")});
		popUp = L.popup().setLatLng(latlng).setContent(popUpcontent).openOn(m);
	});
}
m.on("moveend", getClickable);
getClickable();
function getClickable(){
    function getLayer(z){
     return (z-4)*2;   
    }
    var b = m.getBounds();
    var zoom = m.getZoom();
    var urlT = "http://services.massdot.state.ma.us/ArcGIS/rest/services/RoadInventory/Roads/MapServer/{layer}/query?geometry={bounds}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelContains&returnGeometry=true&outSR=4326&f=json";
	var urlOpt = {layer: getLayer(zoom), bounds:b.toBBoxString()};
	var url = L.Util.template(urlT, urlOpt);
	L.Util.jsonp(url,function (data){
		clickable.clearLayers();
		toGeoJSON(data,function(g){clickable.addData(g);});
	});
}