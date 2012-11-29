var popUp,
	clickable = L.geoJson("",{style:{opacity:0}}).addTo(m);
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
};