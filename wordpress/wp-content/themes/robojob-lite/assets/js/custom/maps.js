jQuery(document).ready(function(){


    jQuery( document ).ajaxComplete(function( evt,request, settings ) {

        var url = settings.url;
        var baseUrl = document.location.pathname;
        var url = settings.url.split('jm-ajax');
        if( (request.statusText == "OK") && (url[1] != null ) ){

            var locations = [];
            var ctr = 1;
            var responseText = jQuery.parseJSON(request.responseText);
            var Html = jQuery(responseText.html);
            var lat, Long;

            jQuery('[data-latitude]', Html.wrapAll(jQuery('<div>')).parent()).each(function (ix, el) {
                var latitude = jQuery(el).data('latitude');
                var longitude = jQuery(el).data('longitude');
                var JobTitle = jQuery(el).find('h3').text();
                var addr = jQuery(el).find('.location').text();
                var loc = [JobTitle, addr, longitude, latitude];
                lat = latitude;
                Long = longitude;
                locations.push(loc);
                ctr++;
            });

            gmarkers = [];

            var map = new google.maps.Map(document.getElementById('googleMap'), {
                center: new google.maps.LatLng(Long, lat),
                zoom: 5,
                scrollwheel: false,
                mapTypeId:google.maps.MapTypeId.ROADMAP
            });

            var infowindow = new google.maps.InfoWindow();

            function createMarker(latlng1, html1) {
                var marker = new google.maps.Marker({
                    position: latlng1,
                    map: map
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(html1);
                    infowindow.open(map, marker);
                });

                return marker;
            }
            var markers =[];
            for (var i = 0; i < locations.length; i++) {
                gmarkers[locations[i][0]] =
                createMarker(new google.maps.LatLng(locations[i][2], locations[i][3]), locations[i][0] + "<br>" + locations[i][1]);
                markers.push(gmarkers[locations[i][0]]);
            }
            var mcOptions = {gridSize: 50, maxZoom: 15};
            var markerCluster = new MarkerClusterer(map, markers, mcOptions);
        }
    });

});
