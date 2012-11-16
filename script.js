var m = L.map('map').setView([42.2, -71], 8),
    h = new L.Hash(m),
    r=L.tileLayer("http://services.massdot.state.ma.us/ArcGIS/rest/services/RoadInventory/Roads/MapServer/tile/{z}/{y}/{x}"),
    t=L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}).addTo(m);
    r.addTo(m);