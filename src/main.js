/*!
  
| . |     | .'| . |_ -|
|_  |_|_|_|__,|  _|___|
|___|         |_|      

Version: 1.0.0
Author: Gabriel Burgos
Website: http://gabrielburgos.cl
Repo: https://github.com/gburgose/jquery-gmaps
Issues: https://github.com/gburgose/jquery-gmaps/issues

**/


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

  /*
  |--------------------------------------------------------------------------
  | Constructor
  |--------------------------------------------------------------------------
  */

  var Gmaps = window.Gmaps || {};

  Gmaps = (function() {

      function Gmaps(element, settings , index) {

        var gmap = this, dataSettings;

        // SET

        gmap.$map = $( element );
        gmap.index = index;
        gmap.id = 'jquery-gmaps-' + index;

        gmap.$map.addClass('googlemap')
                 .addClass('googlemap-load');

        // default settings

        gmap.map = null;
        gmap.markers = [];
        gmap.bounds = null;
        gmap.infowindows = [];

        // set map settings

        gmap.url = "https://maps.googleapis.com/maps/api/js";
        gmap.key = gmap.getMapKey( element );
        gmap.zoom = gmap.getMapZoom( element );
        gmap.clustering = gmap.getMapClustering( element );
        gmap.lang = gmap.getMapLanguage();
        gmap.locations = gmap.getMapLocations( element );
        gmap.style = gmap.getMapStyle( settings );

        // Set map controls

        gmap.zoomControl = gmap.getMapZoomControl( element );
        gmap.typeControl = gmap.getMapTypeControl( element );
        gmap.scaleControl = gmap.getMapScaleControl( element );
        gmap.streetViewControl = gmap.getMapStreetViewControl( element );
        gmap.rotateControl = gmap.getMapRotateControl( element );
        gmap.fullscreenControl = gmap.getMapFullscreenControl( element );

        // Create floating map

        var googlemap = document.createElement('div')      
        $(googlemap).addClass('googlemap-overview');
        $(googlemap).addClass( gmap.id );
        $(element).prepend( $(googlemap) );
        
        // Add script and init map

        gmap._scripts();

      }

      return Gmaps;

  }());

  /*
  |--------------------------------------------------------------------------
  | Add scripts
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._scripts = function() {

    var gmap = this;

    if ( gmap.index == 0 ){

      // Create API script
      
      var _api = gmap.url;

      if ( gmap.key ) {
        _api += '?key=' + gmap.key;
      } else {
        return false;
      }

      var api = document.createElement('script');
      api.type = 'text/javascript';
      api.src = _api;
      api.id = 'gmaps-api';
      api.async = true;
      api.defer = true;
      document.body.appendChild(api);

      // Create clustering script

      if ( gmap.clustering ){

        var _clustering = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";

        var clustering = document.createElement('script');
        clustering.type = 'text/javascript';
        clustering.src = _clustering;
        clustering.id = 'gmaps-clustering';
        clustering.async = true;
        clustering.defer = true;
        document.body.appendChild(clustering);

      }

    }

    var loading = setInterval(function(){
      if ( window.google !== undefined ){
        window.clearInterval( loading );
        gmap.mapInit();
      }
    },200);

  };

  /*
  |--------------------------------------------------------------------------
  | Map Settings
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.getMapLanguage = function(){
    var gmap = this;
    var $html = $('html');
    var _lang = $html.attr('lang');
    if ( _lang === undefined || _lang === "" ){
      _lang = "en";
    }
    return _lang;
  };

  Gmaps.prototype.getMapStyle = function( settings ){
    try {
      return settings.style;
    } catch(err) {
      return false;
    }
  };

  Gmaps.prototype.getMapKey = function( element ){
    var gmap = this;
    var _key = $(element).attr('data-key');
    return _key;
  };

  Gmaps.prototype.getMapZoom = function( element ){
    var gmap = this;
    var _option = $(element).attr('data-zoom');
    if ( _option === undefined || _option === "" ){
      _option = 4;
    }
    return parseInt( _option );
  };

  Gmaps.prototype.getMapZoomControl = function( element ){
    var gmap = this;
    var _option = Boolean( $(element).attr('data-zoom-control') );
    if ( _option === undefined || _option === "" ){
      _option = false;
    }
    return _option;
  };

  Gmaps.prototype.getMapTypeControl = function( element ){
    var gmap = this;
    var _option = Boolean( $(element).attr('data-type-control') );
    if ( _option === undefined || _option === "" ){
      _option = false;
    }
    return _option;
  };

  Gmaps.prototype.getMapScaleControl = function( element ){
    var gmap = this;
    var _option = Boolean( $(element).attr('data-type-control') );
    if ( _option === undefined || _option === "" ){
      _option = false;
    }
    return _option;
  };

  Gmaps.prototype.getMapStreetViewControl = function( element ){
    var gmap = this;
    var _option = Boolean( $(element).attr('data-type-control') );
    if ( _option === undefined || _option === "" ){
      _option = false;
    }
    return _option;
  };

  Gmaps.prototype.getMapRotateControl = function( element ){
    var gmap = this;
    var _option = Boolean( $(element).attr('data-type-control') );
    if ( _option === undefined || _option === "" ){
      _option = false;
    }
    return _option;
  };

  Gmaps.prototype.getMapFullscreenControl = function( element ){
    var gmap = this;
    var _option = Boolean( $(element).attr('data-type-control') );
    if ( _option === undefined || _option === "" ){
      _option = false;
    }
    return _option;
  };

  Gmaps.prototype.getMapClustering = function( element ){
    
    var gmap = this;

    var _clustering = Boolean( $( element ).attr('data-clustering') )

    if ( _clustering === undefined ){
      _clustering = false;
    }

    return _clustering;
  };

  Gmaps.prototype.getMapLocations = function( element ){

    var gmap = this;
    var $locations = $(element).find('.marker');
    var locations = [];

    // Each default locations
    $locations.each(function(i,el){
      var marker = {
        'id' : parseFloat( $(el).attr('data-id') ),
        'lat' : parseFloat( $(el).attr('data-lat') ),
        'lng' : parseFloat( $(el).attr('data-lng') ),
        'html' : $(el).html(),
        'icon' : gmap.getMarkerIcon( el ),
        'draggable' : Boolean( $(el).attr('data-draggable') ),
      };
      locations.push( marker );
    });

    return locations;
  };

  /*
  |--------------------------------------------------------------------------
  | Map Creator
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.mapInit = function() {
    
    var gmap = this;
    var $map = $("."+gmap.id);
    var options = {};

    console.log( gmap.zoomControl );

    options.zoom = gmap.zoom;
    options.zoomControl = gmap.zoomControl;
    options.mapTypeControl = gmap.typeControl;
    options.scaleControl = gmap.scaleControl;
    options.streetViewControl = gmap.streetViewControl;
    options.rotateControl = gmap.rotateControl;
    options.fullscreenControl = true;
    
    /*
    options.draggable = false;
    options.disableDoubleClickZoom = false;
    options.scrollwheel = false
    */

    if ( gmap.style !== false ){
      options.styles = gmap.style;
    }

    gmap.map = new google.maps.Map( $map.get(0) , options );

    // Add default markers
    $.each( gmap.locations , function( index, value ) {
      gmap.addMarker( value );
    });

    // Trigger onLoad
    gmap.$map.trigger('onLoad');

    // Centering
    gmap.setCenter();

    // Clustering
    if ( gmap.clustering ){

      var markerCluster = new MarkerClusterer( gmap.map, gmap.markers,{
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });

    }

  };

  /*
  |--------------------------------------------------------------------------
  | Marker Settings
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.getMarkerIcon = function( element ){

    var gmap = this;

    var _image = $(element).attr('data-marker-image');
    var _width = parseInt( $(element).attr('data-marker-width') );
    var _height = parseInt( $(element).attr('data-marker-height') );

    if ( _image === undefined || !$.isNumeric( _width ) || !$.isNumeric( _height ) ){
      return false;
    }

    var icon = {
      url: _image,
      width: _width,
      height: _height
    };

    return icon;

  }

  /*
  |--------------------------------------------------------------------------
  | Add markers
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.addMarker = function( settings ) {

    var gmap = this;

    // create marker

    var options = {};

    options.id = settings.id
    options.position = new google.maps.LatLng( settings.lat, settings.lng );
    options.map = gmap.map;
    options.clickable = true;
    options.animation = google.maps.Animation.DROP;

    // Custom icon

    if ( settings.icon !== false ){
      options.icon = settings.icon;
      var icon = {
        url: settings.icon.url,
        size: new google.maps.Size( settings.icon.width , settings.icon.height )
      };
    }

    // Is draggable

    if ( settings.draggable !== false ){
      options.draggable = true;
    }

    var marker = new google.maps.Marker( options );

    gmap.markers.push( marker );

    // Create infowindow
    var infowindow = new google.maps.InfoWindow({
      content: settings.html
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
      
      // Callback returns
      var _position = {};
      _position.lat = parseFloat( marker.getPosition().lat() );
      _position.lng = parseFloat( marker.getPosition().lng() );

      gmap.$map.trigger('onMarkerClick', [ _position, settings.id ] );

    });

    gmap.map.setCenter( options.position );

  }

  /*
  |--------------------------------------------------------------------------
  | Center Map
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.setCenter = function() {

    var gmap = this;

    var bounds = new google.maps.LatLngBounds();

    $.each( gmap.locations , function( index, value ) {
      var latlng = new google.maps.LatLng( value.lat, value.lng );
      bounds.extend( latlng );
    });

    if ( gmap.locations.length === 1 ){
      gmap.map.setCenter( bounds.getCenter() );
    } else {
      gmap.map.fitBounds( bounds );
    }

  }

  /*
  |--------------------------------------------------------------------------
  | Reload
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.reload = function() {
  };

  /*
  |--------------------------------------------------------------------------
  | Destroy & ungmaps
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.destroy = function() {
  };

  /*
  |--------------------------------------------------------------------------
  | Init plugin
  |--------------------------------------------------------------------------
  */

  $.fn.gmaps = function() {
    
    var _gmaps = this;
    var _opt = arguments[0];
    var _args = Array.prototype.slice.call(arguments, 1);
    var _length = _gmaps.length;
    var i;
    var _return;

    for (i = 0; i < _length; i++) {
      if (typeof _opt == 'object' || typeof _opt == 'undefined')
        _gmaps[i].gmap = new Gmaps( _gmaps[i], _opt, i);
      else
        _return = _gmaps[i].gmap[_opt].apply(_gmaps[i].gmap, _args);
      if (typeof _return != 'undefined') return _return;
    }

    return _gmaps;

  };

}));