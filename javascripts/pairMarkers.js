window.markers = [];

// Pair Users to Business
function pairMarkers(map, users, business, drawLine) {
    // Set Bounds Object

    // Build Business
    // let businessMarker = addBusinessMarker(map, business);

    let i = -1;
    while (++i < users.length) {

        let user = users[i];
        if(user.deaths > 0){
            let userMarker = addUserMarker(map, user, true);
            window.markers.push(userMarker);
            // userMarker.animateDrop();
        }
        else{
            if(user.confirmed > 0){
                let userMarker = addUserMarker(map, user, false);
                window.markers.push(userMarker);
            }
        }

        // if (drawLine) {
        //     // drawPolyline(map, userMarker.position, businessMarker.position);
        //     drawPolyLine(map, userMarker.position, businessMarker.position);
        // }

    }

}

function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < window.markers.length; i++) {
        window.markers[i].setMap(null);
    }
    window.markers = [];
};