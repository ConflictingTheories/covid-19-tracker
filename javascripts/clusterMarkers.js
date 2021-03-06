// Pair Users to Business
function clusterMarkers(map, users, business, drawLine,bounds) {
    // Business Marker
    let businessMarker = addBusinessMarker(map, business);
    // Set Bounds Object
    bounds.extend(business.pos);
    // Build Business
    let lat = 0;
    let lng = 0;
    let len = users.length;
    let i = -1;
    while (++i < users.length) {
        let user = users[i];
        lat += user.lat;
        lng += user.lng;
    }
    let newLat = (lat / len);
    let newLng = (lng / len);
    // Cluster of users
    let pos = new google.maps.LatLng(newLat, newLng);
    
    bounds.extend(pos);
    // Marker
    addClusterMarker(map, { pos: pos }, false, len);
    if (drawLine) {
        drawPolyLine(map, pos, businessMarker.position);
    }
}