[].indexOf || (Array.prototype.indexOf = function(a, b, c) {
  c = this.length;
  b = (c + ~~b) % c;
  while (b < c && ((!(b in this)) || this[b] !== a)) {
    b++;
  }
  if (b ^ c) {
    return b;
  } else {
    return -1;
  }
});function toGeoJSON(data,cb){
    var outPut = { "type": "FeatureCollection",
  "features": []};
    var fl = data.features.length;
    var i = 0;
    while(fl>i){
     var ft = data.features[i];
/* as only ESRI based products care if all the features are the same type of geometry, check for geometry type at a feature level*/
     var outFT = {
            "type": "Feature",
            "properties":ft.attributes
        };
        if(ft.geometry.x){
//check if it's a point
          outFT.geometry=point(ft.geometry);
        }else if(ft.geometry.points){
//check if it is a multipoint
            outFT.geometry=points(ft.geometry);
            }else if(ft.geometry.paths){
//check if a line (or "ARC" in ESRI terms)
         outFT.geometry=line(ft.geometry);
        }else if(ft.geometry.rings){
//check if a poly.
           outFT.geometry=poly(ft.geometry);  
        }
        
     outPut.features.push(outFT);
     i++;
    }
function point(geometry){
//this one is easy
    return {"type": "Point","coordinates": [geometry.x,geometry.y]};    
}
function points(geometry){
//checks if the multipoint only has one point, if so exports as point instead
    if(geometry.points.length===1){
        return {"type": "Point","coordinates": geometry.points[0]};
    }else{
        return { "type": "MultiPoint","coordinates":geometry.points}; 
    }
}
function line(geometry){
//checks if their are multiple paths or just one
    if(geometry.paths.length===1){
        return {"type": "LineString","coordinates": geometry.paths[0]};
    }else{
        return { "type": "MultiLineString","coordinates":geometry.paths}; 
    }
}
function poly(geometry){
//first we check for some easy cases, like if their is only one ring
    if(geometry.rings.length===1){
        return {"type": "Polygon","coordinates": geometry.rings};
    }else{
/*if it isn't that easy then we have to start checking ring direction, basically the ring goes clockwise its part of the polygon, if it goes counterclockwise it is a hole in the polygon, but geojson does it by haveing an array with the first element be the polygons and the next elements being holes in it*/
        var ccc= dP(geometry.rings);
        var d = ccc[0];
        var dd = ccc[1];
        var r=[];
        if(dd.length===0){
/*if their are no holes we don't need to worry about this, but do need to stuck each ring inside its own array*/
            var l2 = d.length;
            var i3 = 0;
            while(l2>i3){
             r.push([d[i3]]);   
            }
            return { "type": "MultiPolygon","coordinates":r}; 
        }else if(d.length===1){
/*if their is only one clockwise ring then we know all holes are in that poly*/
            dd.unshift(d[0]);
            return {"type": "Polygon","coordinates": dd};
            
        }else{
/*if their are multiple rings and holes we have no way of knowing which belong to which without looking at it specially, so just dump the coordinates and add  a hole field, this may cause errors*/
            return { "type": "MultiPolygon","coordinates":d, "holes":dd};
        }  
    }
}
function dP(a){
//returns an array of 2 arrays, the first being all the clockwise ones, the second counter clockwise
    var d = [];
        var dd =[];
        var l = a.length;
        var ii = 0;
        while(l>ii){
            if(c(a[ii])){
                d.push(a[ii]);
            }else{
             dd.push(a[ii]);
            }
         ii++;
        }
    return [d,dd];
}
function c(a){
//return true if clockwise
 var l = a.length-1;
 var i = 0;
 var o=0;

 while(l>i){
 o+=(a[i][0]*a[i+1][1]-a[i+1][0]*a[i][1]);
   
     i++;
 }
    return o<=0;
}  
if(cb){
 cb(outPut)
}else{
return outPut;  
}
}
var module = module || false;
if (!!module && typeof module !== undefined) module.exports = toGeoJSON;(function(window) {
    var HAS_HASHCHANGE = (function() {
        var doc_mode = window.documentMode;
        return ('onhashchange' in window) &&
            (doc_mode === undefined || doc_mode > 7);
    })();
    
    L.Hash = function(map) {
        this.onHashChange = L.Util.bind(this.onHashChange, this);
    
        if (map) {
            this.init(map);
        }
    };
    
    L.Hash.prototype = {
        map: null,
        lastHash: null,
    
        parseHash: function(hash) {
            if(hash.indexOf('#') == 0) {
                hash = hash.substr(1);
            }
            var args = hash.split("/");
            if (args.length == 3) {
                var zoom = parseInt(args[0], 10),
                    lat = parseFloat(args[1]),
                    lon = parseFloat(args[2]);
                if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
                    return false;
                } else {
                    return {
                        center: new L.LatLng(lat, lon),
                        zoom: zoom
                    };
                }
            } else {
                return false;
            }
        },
    
        formatHash: function(map) {
            var center = map.getCenter(),
                zoom = map.getZoom(),
                precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));
            
            return "#" + [zoom,
                center.lat.toFixed(precision),
                center.lng.toFixed(precision)
            ].join("/");
        },
    
        init: function(map) {
            this.map = map;
            
            this.map.on("moveend", this.onMapMove, this);
            
            // reset the hash
            this.lastHash = null;
            this.onHashChange();
    
            if (!this.isListening) {
                this.startListening();
            }
        },
    
        remove: function() {
            this.map = null;
            if (this.isListening) {
                this.stopListening();
            }
        },
        
        onMapMove: function(map) {
            // bail if we're moving the map (updating from a hash),
            // or if the map has no zoom set
            
            if (this.movingMap || this.map.getZoom() === 0) {
                return false;
            }
            
            var hash = this.formatHash(this.map);
            if (this.lastHash != hash) {
                location.replace(hash);
                this.lastHash = hash;
            }
        },
    
        movingMap: false,
        update: function() {
            var hash = location.hash;
            if (hash === this.lastHash) {
                // console.info("(no change)");
                return;
            }
            var parsed = this.parseHash(hash);
            if (parsed) {
                // console.log("parsed:", parsed.zoom, parsed.center.toString());
                this.movingMap = true;
                
                this.map.setView(parsed.center, parsed.zoom);
                
                this.movingMap = false;
            } else {
                // console.warn("parse error; resetting:", this.map.getCenter(), this.map.getZoom());
                this.onMapMove(this.map);
            }
        },
    
        // defer hash change updates every 100ms
        changeDefer: 100,
        changeTimeout: null,
        onHashChange: function() {
            // throttle calls to update() so that they only happen every
            // `changeDefer` ms
            if (!this.changeTimeout) {
                var that = this;
                this.changeTimeout = setTimeout(function() {
                    that.update();
                    that.changeTimeout = null;
                }, this.changeDefer);
            }
        },
    
        isListening: false,
        hashChangeInterval: null,
        startListening: function() {
            if (HAS_HASHCHANGE) {
                L.DomEvent.addListener(window, "hashchange", this.onHashChange);
            } else {
                clearInterval(this.hashChangeInterval);
                this.hashChangeInterval = setInterval(this.onHashChange, 50);
            }
            this.isListening = true;
        },
    
        stopListening: function() {
            if (HAS_HASHCHANGE) {
                L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
            } else {
                clearInterval(this.hashChangeInterval);
            }
            this.isListening = false;
        }
    };
    L.hash = function(map){
        return new L.Hash(map);	
    };
    L.Map.prototype.addHash = function(){
		this._hash = L.hash(this);
	};
	L.Map.prototype.removeHash = function(){
		this._hash.remove();
	}
})(window);L.GeoJSON.AJAX=L.GeoJSON.extend({
    defaultAJAXparams:{
     dataType:"json",
     callbackParam:"callback"
    },
    initialize: function (url, options) { // (String, Object)

        this._url = url;
        var ajaxParams = L.Util.extend({}, this.defaultAJAXparams);

        for (var i in options) {
			if (this.defaultAJAXparams.hasOwnProperty(i)) {
				ajaxParams[i] = options[i];
			}
		}

		this.ajaxParams = ajaxParams;
        this._layers = {};
		L.Util.setOptions(this, options);
        if(this._url){
            this.addUrl(this._url);
        }
    },
    addUrl: function (url) {
        var _this = this;
        _this._url = url;
        if(this.ajaxParams.dataType.toLowerCase()==="json"){
          L.Util.ajax(url, function(data){_this.addData(data);}); 
        }else if(this.ajaxParams.dataType.toLowerCase()==="jsonp"){
            L.Util.jsonp(url, function(data){_this.addData(data);}, _this.ajaxParams.callbackParam);
        }
    },
    refresh: function (url){
    url = url || this._url;
    this.clearLayers();
    this.addUrl(url);
    }
});
L.Util.ajax = function (url, cb){
    var response, request = new XMLHttpRequest();
    request.open("GET",url);
    request.onreadystatechange = function(){
        if (request.readyState === 4 && request.status === 200 ){
            response = JSON.parse(request.responseText);
            cb(response);
        }
    };
    request.send();    
};
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
L.geoJson.ajax = function (geojson, options) {
    return new L.GeoJSON.AJAX(geojson, options);
};var m = L.map('map').setView([42.2, -71], 8),
    r=L.tileLayer("//services.massdot.state.ma.us/ArcGIS/rest/services/RoadInventory/Roads/MapServer/tile/{z}/{y}/{x}",{attribution: 'Road Tiles from <a href="http://www.massdot.state.ma.us/planning/Main.aspx" target="_blank">MassDOT Planning</a>'}).addTo(m),
    t=L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});
    var mapQuestAttr = 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; ';
var osmDataAttr = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
m.addHash();
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
var tlayer = L.layerGroup();
var overlayMaps = {
 "Roads":r, 
 "test":tlayer
};
var lc=L.control.layers(baseMaps, overlayMaps);
lc.addTo(m);
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