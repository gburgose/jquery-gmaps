;(function(factory) {
    
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
      module.exports = factory(require('jquery'));
    } else {
      factory(jQuery);
    }

}(function($) {

  'use strict';

  var Gmaps = window.Gmaps || {};

  Gmaps = (function() {

      function Gmaps(element, settings) {

        var gmap = this, dataSettings;
        var index = $(element).index();

        gmap.index = index;
        gmap.id = 'jquery-gmaps-' + index;

        gmap.url = "https://maps.googleapis.com/maps/api/js";
        gmap.key = gmap._getKey( element );
        gmap.zoom = gmap._getZoom( element );
        gmap.lang = gmap._getLanguage();
        gmap.markers = gmap._getMarkers( element );

        gmap.map = null;
        gmap.bounds = null;
        gmap.infowindows = [];

        // Create floating map
        $(element).addClass('googlemap');

        var googlemap = document.createElement('div')      
        $(googlemap).addClass('googlemap-overview');
        $(googlemap).addClass( gmap.id );
        $(element).prepend( $(googlemap) );
        
        // Add script and init map
        gmap.script(true);

      }

      return Gmaps;

  }());

  Gmaps.prototype._getKey = function( element ){

    var gmap = this;
    var _key = $(element).attr('data-key');

    return _key;

  };

  Gmaps.prototype._getZoom = function( element ){

    var gmap = this;
    var _zoom = $(element).attr('data-zoom');

    if ( _zoom === undefined || _zoom === "" ){
      _zoom = 4;
    }

    return parseInt( _zoom );
    
  };

  Gmaps.prototype.getIcon = function( element ){

    var gmap = this;

  };

  Gmaps.prototype._getLanguage = function(){
    
    var gmap = this;
    var $html = $('html');
    var _lang = $html.attr('lang');
    
    if ( _lang === undefined || _lang === "" ){
      _lang = "en";
    }

    return _lang;

  };

  Gmaps.prototype._getMarkers = function( element ){

    var $markers = $(element).find('.marker');
    var markers = [];

    // Each default markers
    $markers.each(function(i,el){
      var marker = {
        'lat' : parseFloat( $(el).attr('data-lat') ),
        'lng' : parseFloat( $(el).attr('data-lng') ),
        'html' : $(el).html()
      };
      markers.push( marker );
    });

    return markers;

  };

  Gmaps.prototype.script = function(creation) {

    var gmap = this;

    if ( gmap.index == 0 ){
      
      var _url = gmap.url;

      if ( gmap.key ) {
        _url += '?key=' + gmap.key;
      } else {
        return false;
      }

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = _url;
      script.id = 'gmaps-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

    }

    var loading = setInterval(function(){
      if ( window.google !== undefined ){
        window.clearInterval( loading );
        gmap.create();
      }
    },100);

  };

  Gmaps.prototype.create = function() {
    
    var gmap = this;
    var $map = $("."+gmap.id);

    gmap.map = new google.maps.Map( $map.get(0) , {
      zoom: gmap.zoom,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    // Add default markers
    $.each( gmap.markers , function( index, value ) {
      gmap.addMarker( value.lat, value.lng, value.html );
    });

    // Center map
    gmap.setCenter();

  };

  Gmaps.prototype.addMarker = function( lat, lng, html ) {

    var gmap = this;

    var marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: gmap.map
    });

    var infowindow = new google.maps.InfoWindow({
      content: html
    });

    gmap.infowindows.push( infowindow );

    marker.addListener('click', function() {
      // close others infowindow
      $.each( gmap.infowindows , function( index, object ) {
        object.close();
      });
      // open infowindow
      infowindow.open(gmap.map, marker);
      // Center at marker
      gmap.map.setCenter( this.getPosition() );
    });

    gmap.map.setCenter({ lat: lat, lng: lng });

  }

  Gmaps.prototype.setCenter = function() {

    var gmap = this;

    var bounds = new google.maps.LatLngBounds();

    $.each( gmap.markers , function( index, value ) {
      var latlng = new google.maps.LatLng( value.lat, value.lng );
      bounds.extend( latlng );
    });

    if ( gmap.markers.length === 1 ){
      gmap.map.setCenter( bounds.getCenter() );
    } else {
      gmap.map.fitBounds( bounds );
    }

  }

  /*
    Create plugin
  */

  $.fn.gmaps = function() {
    
    var _gmaps = this;
    var opt = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    var l = _gmaps.length;
    var i;
    var ret;

    for (i = 0; i < l; i++) {
      if (typeof opt == 'object' || typeof opt == 'undefined')
        _gmaps[i].gmap = new Gmaps( _gmaps[i], opt);
      else
        ret = _gmaps[i].gmap[opt].apply(_gmaps[i].gmap, args);
      if (typeof ret != 'undefined') return ret;
    }

    return _gmaps;

  };

}));