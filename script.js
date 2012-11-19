var L = this.L;
L.Util.jsonp = function (url, cb, cbParam, callbackName){
    var cbn,ourl,cbs;
    var cbParam = cbParam || "callback";
    if(callbackName){
        cbn= callbackName;
    }else{
        cbs = "_" + Math.floor(Math.random()*1000000);
        cbn = "L.Util.jsonp.cb." + cbs;
    }
    L.Util.jsonp.cb = {};
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
m.on("click", getInfo);
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