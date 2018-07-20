/**

| . |     | .'| . |_ -|
|_  |_|_|_|__,|  _|___|
|___|         |_|

Author: Gabriel Burgos
Website: http://gabrielburgos.cl
Repo: https://github.com/gburgose/jquery-gmaps
Issues: https://github.com/gburgose/jquery-gmaps/issues

*/

(function ( $ ) {

  /*
  |--------------------------------------------------------------------------
  | Constructor
  |--------------------------------------------------------------------------
  */

  var Gmaps = window.Gmaps || {};

  Gmaps = (function() {

      function Gmaps( element, settings ) {

        var _ = this;

        // Properties

        _.element = element;
        _.settings = settings;
        _.$canvas = null;
        _.$map = $( element );
        _.id = 'jquery-gmaps-' + _.___createId(5);

        _.map = null;
        _.markers = [];
        _.bounds = null;
        _.infowindows = [];

        // config

        _.properties = []
        _.properties.map = []
        _.properties.map.api = []
        _.properties.map.option = []
        _.properties.map.control = []
        _.properties.map.event = []

        // Properties locations
        _.locations = _.getLocations( _.element );

        _._init( _.element );

      }

      return Gmaps;

  }());

  Gmaps.prototype._init = function( element ) {
    var _ = this;
    // default settings
    _._getMapProperties();
    // Create floating map
    _._canvas();
    // Add script and init map
    _._scripts();
  }

  /*
  |--------------------------------------------------------------------------
  | Canvas
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._canvas = function() {

    var _ = this;

    // Destroy
    if ( _.$map.find('.googlemap-overview').length > 0 ){
      _.$map.find('.googlemap-overview').remove();
    }

    // Create
    var _googlemap = document.createElement('div');
    $( _googlemap ).addClass('googlemap-overview');
    $( _googlemap ).addClass( _.id );
    $( _.element ).prepend( $( _googlemap ) );

    return _.$canvas = $( _googlemap );

  };

  /*
  |--------------------------------------------------------------------------
  | Add scripts
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._scripts = function() {

    var _ = this;

    if ( $('#gmaps-api').length === 0 ){

      // Create API script

      var _api = "//maps.googleapis.com/maps/api/js";

      _api += '?key='      + _.properties.map.api.key;
      _api += '&language=' + _.properties.map.api.lang;

      var api = document.createElement('script');
      api.type = 'text/javascript';
      api.src = _api;
      api.id = 'gmaps-api';
      api.async = true;
      api.defer = true;
      document.body.appendChild(api);

      // Create clustering script

      if ( _.properties.map.option.clustering ){

        var _clustering = "//developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";

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
        _.mapInit();
      }
    },200);

  };

  /*
  |--------------------------------------------------------------------------
  | Map Config
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._getMapProperties = function(){

    var _ = this;

    // Properties style
    _.properties.map.style                =   _._getMapStyle( _.settings );
    _.properties.map.theme                =   _._getMapTheme( "default" );

    // Properties api options
    _.properties.map.api.key              =   _._getMapApiKey( undefined );
    _.properties.map.api.lang             =   _._getMapApiLanguage( "en" );

    // Properties map options
    _.properties.map.option.zoom         =   _._getMapOptionZoom( 4 );
    _.properties.map.option.zoom_min     =   _._getMapOptionZoomMin( 1 );
    _.properties.map.option.zoom_max     =   _._getMapOptionZoomMax( 16 );
    _.properties.map.option.type         =   _._getMapOptionType( 'roadmap' );
    _.properties.map.option.clustering   =   _._getMapOptionClustering( false );

    // Properties map controls
    _.properties.map.control.zoom        =   _._getMapControlZoom( false );
    _.properties.map.control.type        =   _._getMapControlType( false );
    _.properties.map.control.scale       =   _._getMapControlScale( false );
    _.properties.map.control.streetview  =   _._getMapControlStreetView( false );
    _.properties.map.control.rotate      =   _._getMapControlRotate( false );
    _.properties.map.control.fullscreen  =   _._getMapControlFullscreen( false );

    // Properties map events
    _.properties.map.event.draggable     =   _._getMapEventDraggable( true );
    _.properties.map.event.dblclickZoom  =   _._getMapEventControlClickZoom( true );
    _.properties.map.event.scrollwheel   =   _._getMapEventScrollWheel( false );

  };

  /*
  |--------------------------------------------------------------------------
  | Map Look
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._getMapTheme = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-theme");

    try{
      _by_setting = _.settings.api.key;
    } catch(e) {}

    if ( typeof _by_attr === "string" )
    {
      _return = _by_attr;
    }
    else if ( typeof _by_setting === "string" )
    {
      _return = _.settings.api.key;
    }
    else
    {
      _return = _by_default;
    }

    return _return;

  };

  /*
  |--------------------------------------------------------------------------
  | API Settings
  |--------------------------------------------------------------------------
  */

  /**
    Return google maps api key
    @request {string} [key=AIzaSyAiKl_QPZ8L92aLRfpH23F5jzEuIETEhWw]
    @returns {string}
  */

  Gmaps.prototype._getMapApiKey = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-key");

    try{
      _by_setting = _.settings.api.key;
    } catch(e) {}

    if ( typeof _by_attr === "string" )
    {
      _return = _by_attr;
    }
    else if ( typeof _by_setting === "string" )
    {
      _return = _.settings.api.key;
    }
    else
    {
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return map language
    @request {string} [lang=es]
    @returns {string}
  */

  Gmaps.prototype._getMapApiLanguage = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-lang"),
        _by_html = $('html').attr("lang");

    try{
      _by_setting = _.settings.api.lang;
    } catch(e) {}

    if ( typeof _by_attr === "string" )
    {
      _return = _by_attr;
    }
    else if ( typeof _by_setting === "string" )
    {
      _return = _.settings.api.lang;
    }
    else if ( typeof _by_html === "string" )
    {
      _return = _by_html;
    }
    else
    {
      _return = _by_default;
    }

    return _return;

  };

  /*
  |--------------------------------------------------------------------------
  | Map Settings
  |--------------------------------------------------------------------------
  */

  /**
    Return map zoom
    @request {integer} [zoom=4]
    @returns {string}
  */

  Gmaps.prototype._getMapOptionZoom = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = parseInt( _.$map.attr("data-zoom") );

    try{
      _by_setting = parseInt( _.settings.map.zoom );
    } catch(e) {}

    if ( typeof _by_attr === "number" && _by_attr > 0 ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "number" && _by_setting > 0 ){
      _return = _.settings.map.zoom;
    } else {
      _return = _by_default;
    }

    /* Validate min and max */
    if ( _return > 0 && _return < 17 ){
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return map zoom min
    @request {integer} [zoom=1]
    @returns {integer}
  */

  Gmaps.prototype._getMapOptionZoomMin = function( _default ){

    var _ = this;

    var _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = parseInt( _.$map.attr("data-zoom-min") );

    try{
      _by_setting = parseInt( _.settings.map.zoom_min );
    } catch(e) {}

    if ( typeof _by_attr === "number" && _by_attr > 0 ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "number" && _by_setting > 0 ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    /* Validate min and max */
    if ( _return > 0 && _return < 17 ){
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return map zoom max
    @request {integer} [zoom-max=1]
    @returns {integer}
  */

  Gmaps.prototype._getMapOptionZoomMax = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = parseInt( _.$map.attr("data-zoom-max") );

    try{
      _by_setting = parseInt( _.settings.map.zoom_max );
    } catch(e) {}

    if ( typeof _by_attr === "number" && _by_attr > 0 ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "number" && _by_setting > 0 ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    /* Validate min and max */
    if ( _return > 0 && _return < 17 ){
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return map type
    @request {string} [type='roadmap' || 'satellite' || 'hybrid' || 'terrain' ]
    @returns {string}
  */

  Gmaps.prototype._getMapOptionType = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-type");

    try{
      _by_setting = _.settings.map.type;
    } catch(e) {}

    if ( typeof _by_attr === "string" && typeof _by_attr !== "undefined" ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "string" && typeof _by_setting !== "undefined" ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    /* Validate by google maps options for mapTypeId */

    if ( _return !== "roadmap" || _return !== "satellite" || _return !== "hybrid" || _return !== "terrain" ){
      _return = _default;
    }

    return _return;

  };

  /**
    Return if the map set clustering
    @request {boolean} [clustering=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapOptionClustering = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-clustering");

    try{
      _by_setting = _.settings.map.clustering;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /*
  |--------------------------------------------------------------------------
  | Map Controls
  |--------------------------------------------------------------------------
  */

  /**
    Return if the map set control zoom
    @request {boolean} [control-zoom=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapControlZoom = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-control-zoom");

    try{
      _by_setting = _.settings.control.zoom;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return if the map set control type map
    @request {boolean} [control-type=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapControlType = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-control-type");

    try{
      _by_setting = _.settings.control.type;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return if the map set control type map
    @request {boolean} [control-scale=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapControlScale = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-control-scale");

    try{
      _by_setting = _.settings.control.scale;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return if the map set control street view map
    @request {boolean} [control-scale=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapControlStreetView = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-control-streetview");

    try{
      _by_setting = _.settings.control.streetview;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return if the map set control rotate map
    @request {boolean} [control-scale=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapControlRotate = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-control-rotate");

    try{
      _by_setting = _.settings.control.rotate;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return if the map set control fullscreen map
    @request {boolean} [control-scale=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapControlFullscreen = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-control-fullscreen");

    try{
      _by_setting = _.settings.control.fullscreen;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /**
    Return if the map set control double click map
    @request {boolean} [control-scale=false]
    @returns {boolean}
  */

  Gmaps.prototype._getMapEventControlClickZoom = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-event-dblclickzoom");

    try{
      _by_setting = _.settings.event.dblclickZoom;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    if ( _return === true ){
      _return = false;
    } else {
      _return = true;
    }


    return _return;

  };

  /*
  |--------------------------------------------------------------------------
  | Map Events
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._getMapEventDraggable = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-control-fullscreen");

    try{
      _by_setting = _.settings.control.fullscreen;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };



  Gmaps.prototype._getMapEventScrollWheel = function( _default ){

    var _ = this,
        _return,
        _by_default = _default,
        _by_setting = null,
        _by_attr = _.$map.attr("data-event-scrollwheel");

    try{
      _by_setting = _.settings.event.scrollwheel;
    } catch(e) {}

    if ( typeof _by_attr === "boolean" && ( typeof _by_attr !== "true" || typeof _by_attr !== "false" ) ){
      _return = _by_attr;
    } else if ( typeof _by_setting === "boolean" && ( typeof _by_setting !== "true" || typeof _by_setting !== "false" ) ){
      _return = _by_setting;
    } else {
      _return = _by_default;
    }

    return _return;

  };

  /*
  |--------------------------------------------------------------------------
  | Map Style
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._getMapStyle = function( settings ){

    try {
      return settings.style;
    } catch(err) {
      return false;
    }

  };

  /*
  |--------------------------------------------------------------------------
  | Locations
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.getLocations = function( element ){

    var _ = this;

    var $locations = $(element).find('.marker');
    var locations = [];

    $locations.each(function( i, marker ){

      var _lat = $( marker ).attr('data-lat');
      var _lng = $( marker ).attr('data-lng');
      var _uid = $( marker ).attr('data-id');

      var marker = {
        'id' : _.getMarkerID( _uid ),
        'lat' : _lat,
        'lng' : _lng,
        'html' : $( marker ).html(),
        'icon' : _.getMarkerIcon( marker ),
        'draggable' : _.getMarkerEventDraggable( marker ),
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

    var _ = this;
    var _opts = {};

    // Map settings

    _opts.zoom                      = _.properties.map.option.zoom;
    _opts.minZoom                   = _.properties.map.option.zoom_min;
    _opts.maxZoom                   = _.properties.map.option.zoom_max;
    _opts.mapTypeId                 = _.properties.map.option.type;

    // Map controls

    _opts.zoomControl               = _.properties.map.control.zoom;
    _opts.mapTypeControl            = _.properties.map.control.type;
    _opts.scaleControl              = _.properties.map.control.scale;
    _opts.streetViewControl         = _.properties.map.control.streetview;
    _opts.rotateControl             = _.properties.map.control.rotate;
    _opts.fullscreenControl         = _.properties.map.control.fullscreen;

    _opts.draggable                 = _.properties.map.event.draggable;
    _opts.disableDoubleClickZoom    = _.properties.map.event.dblclickZoom;
    _opts.scrollwheel               = _.properties.map.event.scrollwheel;

    _.$map.addClass( 'googlemap' )
          .addClass( 'googlemap-load' );

    // Add Theme
    var _look = _._setLook( _.properties.map.theme );
    if ( _look !== false ){
      _opts.styles = _look.style;
      _.$map.addClass( _look.class );
    }

    // Adding style
    if ( _.properties.map.style !== false ){
      _opts.styles = _.properties.map.style;
    }

    _.map = new google.maps.Map( _.$canvas.get(0) , _opts );

    // Add _default markers
    $.each( _.locations , function( index, value ) {
      _.addMarker( value );
    });

    // Trigger onLoad
    _.$map.trigger('onLoad');

    // Centering
    _.setCenter();

    // Clustering
    if ( _.properties.map.option.clustering ){
      var markerCluster = new MarkerClusterer( _.map, _.markers,{
        imagePath: '//developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }

  };

  /*
  |--------------------------------------------------------------------------
  | Marker Settings
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.getMarkerID = function( _default ){

    var _ = this,
        _value = _default,
        _return;

    if ( _value === undefined ){
      _return = _.___createId(10);
    } else {
      _return = _.___slugify(_value);
    }

    return _return;

  }

  Gmaps.prototype.getMarkerIcon = function( element ){

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

  };

  /*
  |--------------------------------------------------------------------------
  | Marker Events
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.getMarkerEventDraggable = function( element ){
    var _setting = Boolean( $(element).attr('data-draggable') );
    if ( _setting === undefined || _setting === "" ){
      _setting = false;
    }
    return _setting;
  };

  Gmaps.prototype.getMarkerEventClickeable = function( element ){
    var _setting = Boolean( $(element).attr('data-clickeable') );
    if ( _setting === undefined || _setting === "" ){
      _setting = false;
    }
    return _setting;
  };

  /*
  |--------------------------------------------------------------------------
  | Add markers
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.addMarker = function( settings ) {

    var _ = this;

    // create marker

    var options = {};

    options.id = settings.id
    options.position = new google.maps.LatLng( settings.lat, settings.lng );
    options.map = _.map;
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

    _.markers.push( marker );

    if ( settings.html ){

      // Create infowindow
      var infowindow = new google.maps.InfoWindow({
        content: settings.html
      });

      _.infowindows.push( infowindow );

      // Load event
      google.maps.event.addListener(infowindow, 'domready', function() {

         // Reference to the DIV which receives the contents of the infowindow using jQuery
         var _bubble = $('.gm-style-iw');

         /* parent container */
         var _parent = _bubble.parent().addClass('bubble');
         //_parent.hide();

         /* background */
         var _background = _bubble.prev();
         // Remove the background shadow DIV & the white background DIV
         _background.children(':nth-child(2)').css({'display' : 'none'});
         _background.children(':nth-child(4)').css({'display' : 'none'});

         // Moves the shadow of the arrow 76px to the left margin.
         var _container = _bubble;
         _container.addClass('bubble-container');
         _container.removeClass('gm-style-iw');

         // Overview
         var _overview = _container.children(':nth-child(1)');
         _overview.addClass('bubble-container-overview');

         // Close button custom style
         var _close = _bubble.next();
         _close.addClass('bubble-close');
         _close.find('img').remove();
         _close.attr('style','');

         // load bubble
         // _parent.addClass('is-load');

      });

      // Click event
      marker.addListener('click', function() {

        // close others infowindow
        $.each( _.infowindows , function( index, object ) {
          object.close();
        });

        // open infowindow
        infowindow.open(_.map, marker);

        // Center at marker
        // _.map.setCenter( this.getPosition() );

        // Callback returns
        var _position = {};
        _position.lat = parseFloat( marker.getPosition().lat() );
        _position.lng = parseFloat( marker.getPosition().lng() );

        _.$map.trigger('onMarkerClick', [ _position, settings.id ] );

      });

    }

    _.map.setCenter( options.position );

  }

  /*
  |--------------------------------------------------------------------------
  | Open markers
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.openMarker = function( id ) {

    var _ = this;

    $.each( _.markers , function( index, marker ) {
      if ( marker.id === id ){
        new google.maps.event.trigger( marker, 'click' );
      }
    });

  };

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
  | Styles Maps
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype._makerLook = function() {

    var look = [];

    look.push({
      'name' : 'black',
      'class' : 'gmaps-style-black',
      'style' : [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
    })

    look.push({
      'name' : 'green',
      'class' : 'gmaps-style-green',
      'style' : [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a0d6d1"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#dedede"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#dedede"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f1f1f1"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
    })

    look.push({
      'name' : 'red',
      'class' : 'gmaps-style-red',
      'style' : [{"stylers":[{"hue":"#dd0d0d"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]}]
    })

    look.push({
      'name' : 'blue',
      'class' : 'gmaps-style-blue',
      'style' : [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}]
    })

    look.push({
      'name' : 'gray',
      'class' : 'gmaps-style-gray',
      'style' : [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
    })


    return look;

  };

  Gmaps.prototype._setLook = function( _theme ) {
    var _ = this;
    if ( _theme === 'default' ) return false;
    var result = $.grep( _._makerLook() , function(e){  return e.name === _theme; });
    if ( result[0] === undefined ) return false;
    return result[0];
  }

  /*
  |--------------------------------------------------------------------------
  | Reload
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.reload = function() {
    var _ = this;
    _._init( _.element );
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
  | Functions API
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.___getLatLng = function( _latitude, _longitude ) {

    var _return = new google.maps.LatLng( _latitude , _longitude );
    return _return;

  };

  /*
  |--------------------------------------------------------------------------
  | Functions JS
  |--------------------------------------------------------------------------
  */

  Gmaps.prototype.___slugify = function( _string ) {

    return _string.toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

  };

  Gmaps.prototype.___createId = function( _lenght ) {

    var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var _return = '';

    for (var i = 0; i < _lenght; i++) {
        var _rnd = Math.floor(Math.random() * charset.length);
        _return += charset.substring( _rnd , _rnd + 1 );
    }

    return _return;

  };

  /*
  |--------------------------------------------------------------------------
  | jQuery Plugin
  |--------------------------------------------------------------------------
  */

  $.fn.gmaps = function() {

    var _gmaps = this;
    var _opt = arguments[0];
    var _args = Array.prototype.slice.call(arguments, 1);
    var _length = _gmaps.length;
    var i;
    var _return;
    var _context;

    for (i = 0; i < _length; i++) {
      if (typeof _opt === 'object' || typeof _opt === 'undefined'){
        _gmaps[i].gmap = new Gmaps( _gmaps[i], _opt );
      } else {
        _return = _gmaps[i].gmap[_opt];
        _context = _gmaps[i].gmap;

        if (typeof _return === 'undefined') {
          _return = _gmaps[i].gmap.map[_opt];
          _context = _gmaps[i].gmap.map;
        }

        if (typeof _return === 'function') {
          _return = _return.apply(_context, _args);
        }
      }

      if (typeof _return !== 'undefined') return _return;
    }

    return _gmaps;

  };

}( jQuery ));
