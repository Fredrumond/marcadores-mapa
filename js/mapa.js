var map;

function initialize() {
    var latlng = new google.maps.LatLng(-19.852292, -43.962068);
    //-19.918953, -43.938629
    //-19.852292, -43.962068
    var options = {
        zoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), options);

    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input'));

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);  // Why 17? Because it looks good.
        }
        marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        // Add circle overlay and bind to marker
        var circle = new google.maps.Circle({
            map: map,
            radius: 1609,    // 10 miles in metres
            fillColor: '#AA0000'
        });

        circle.bindTo('center', marker, 'position');

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        // infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        // infowindow.open(map, marker);
    });
    carregarPontos();
}

// initialize();

function carregarPontos() {

    $.getJSON('js/pontos.json', function (pontos) {
        console.log(pontos)
        $.each(pontos, function (index, ponto) {

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(ponto.lat, ponto.lng),
                title: ponto.nome,
                map: map,
                icon: 'img/marcador.png'
            });

            // var infowindow = new google.maps.InfoWindow({
            //     content: "<div style='float:left'><img src='http://i.stack.imgur.com/g672i.png'></div><div style='float:right; padding: 10px;'><b>Title</b><br/>123 Address<br/> City,Country</div>"
            // }), marker;
            // google.maps.event.addListener(marker, 'click', (function (marker, i) {
            //     return function () {
            //         infowindow.setContent("Conteúdo do marcador.");
            //         infowindow.open(map, marker);
            //     }
            // })(marker))
            var content = '<div id="iw-container">' +
                '<div class="iw-title">Frederico Drumond</div>' +
                '<div class="iw-content">' +
                '<div class="iw-subTitle">Arquiteto</div>' +
                '<img class="img-perfil" src="img/perfil.jpg" alt="Porcelain Factory of Vista Alegre">' +
                '<p>Projetos concluídos: 52 <br> Recomendações: 51  Registrado desde: 28/09/2017</p>' +
                '<div class="iw-subTitle">Contato</div>' +
                '<p>Rua dois, bairro, Belo Horizonte<br>' +
                '<br>Telefone. 31 34567856 <br>e-mail: fred@arquitetura.br</p>' +
                '</div>' +
                '<div class="iw-bottom-gradient"></div>' +
                '</div>';
            infowindow = new google.maps.InfoWindow({
                // content: "<img class='img-perfil' src='img/perfil.jpg'><b>Title</b><br/>123 Address<br/> City,Country"
                content: content,
                maxWidth: 350
            });

            google.maps.event.addListener(marker, "click", function () {
                infowindow.open(map, marker);
            });

            google.maps.event.addListener(map, 'click', function () {
                infowindow.close();
            });

            google.maps.event.addListener(infowindow, 'domready', function () {

                // Reference to the DIV that wraps the bottom of infowindow
                var iwOuter = $('.gm-style-iw');

                /* Since this div is in a position prior to .gm-div style-iw.
                 * We use jQuery and create a iwBackground variable,
                 * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                */
                var iwBackground = iwOuter.prev();

                // Removes background shadow DIV
                iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

                // Removes white background DIV
                iwBackground.children(':nth-child(4)').css({ 'display': 'none' });

                // Moves the infowindow 115px to the right.
                iwOuter.parent().parent().css({ left: '115px' });

                // Moves the shadow of the arrow 76px to the left margin.
                iwBackground.children(':nth-child(1)').attr('style', function (i, s) { return s + 'left: 76px !important;' });

                // Moves the arrow 76px to the left margin.
                iwBackground.children(':nth-child(3)').attr('style', function (i, s) { return s + 'left: 76px !important;' });

                // Changes the desired tail shadow color.
                iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1' });

                // Reference to the div that groups the close button elements.
                var iwCloseBtn = iwOuter.next();

                // Apply the desired effect to the close button
                iwCloseBtn.css({ opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9' });

                // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
                if ($('.iw-content').height() < 140) {
                    $('.iw-bottom-gradient').css({ display: 'none' });
                }

                // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
                iwCloseBtn.mouseout(function () {
                    $(this).css({ opacity: '1' });
                });
            });

            // infowindow.open(map, marker);
        });

        // // Add circle overlay and bind to marker
        //     var circle = new google.maps.Circle({
        //         map: map,
        //         radius: 16093,    // 10 miles in metres
        //         fillColor: '#AA0000'
        //     });

        //     circle.bindTo('center', marker, 'position');

    });

}

