/**
| . |     | .'| . |_ -|
|_  |_|_|_|__,|  _|___|
|___|         |_|      
Author: Gabriel Burgos
Website: http://gabrielburgos.cl
Repo: https://github.com/gburgose/jquery-gmaps
Issues: https://github.com/gburgose/jquery-gmaps/issues
*/
(function($) {
  'use strict';
  var Gmaps = window.Gmaps || {};
  Gmaps = (function() {
    function Gmaps(element, settings, index) {
      var _ = this;
      _.element = element;
      _.settings = settings;
      _.$canvas = null;
      _.$map = $(element);
      _.index = index;
      _.id = 'jquery-gmaps-' + index;
      _.map = null;
      _.markers = [];
      _.bounds = null;
      _.infowindows = [];
      _.properties = []
      _.properties.map = []
      _.properties.map.api = []
      _.properties.map.option = []
      _.properties.map.control = []
      _.properties.map.event = []
      _.locations = _.getLocations(_.element);
      _._init(_.element);
    }
    return Gmaps;
  }());
  Gmaps.prototype._init = function(element) {
    var _ = this;
    _._getMapProperties();
    _._canvas();
    _._scripts();
  }
  Gmaps.prototype._canvas = function() {
    var _ = this;
    if (_.$map.find('.googlemap-overview').length > 0) {
      _.$map.find('.googlemap-overview').remove();
    }
    var _googlemap = document.createElement('div');
    $(_googlemap).addClass('googlemap-overview');
    $(_googlemap).addClass(_.id);
    $(_.element).prepend($(_googlemap));
    return _.$canvas = $(_googlemap);
  };
  Gmaps.prototype._scripts = function() {
    var _ = this;
    if ($('#gmaps-api').length === 0) {
      var _api = "//maps.googleapis.com/maps/api/js";
      _api += '?key=' + _.properties.map.api.key;
      _api += '&language=' + _.properties.map.api.lang;
      var api = document.createElement('script');
      api.type = 'text/javascript';
      api.src = _api;
      api.id = 'gmaps-api';
      api.async = true;
      api.defer = true;
      document.body.appendChild(api);
      if (_.properties.map.option.clustering) {
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
    var loading = setInterval(function() {
      if (window.google !== undefined) {
        window.clearInterval(loading);
        _.mapInit();
      }
    }, 200);
  };
  Gmaps.prototype._getMapProperties = function() {
    var _ = this;
    _.properties.map.style = _._getMapStyle(_.settings);
    _.properties.map.api.key = _._getMapApiKey(undefined);
    _.properties.map.api.lang = _._getMapApiLanguage("en");
    _.properties.map.option.zoom = _._getMapOptionZoom(4);
    _.properties.map.option.zoom_min = _._getMapOptionZoomMin(1);
    _.properties.map.option.zoom_max = _._getMapOptionZoomMax(16);
    _.properties.map.option.type = _._getMapOptionType('roadmap');
    _.properties.map.option.clustering = _._getMapOptionClustering(false);
    _.properties.map.control.zoom = _._getMapControlZoom(false);
    _.properties.map.control.type = _._getMapControlType(false);
    _.properties.map.control.scale = _._getMapControlScale(false);
    _.properties.map.control.streetview = _._getMapControlStreetView(false);
    _.properties.map.control.rotate = _._getMapControlRotate(false);
    _.properties.map.control.fullscreen = _._getMapControlFullscreen(false);
    _.properties.map.event.draggable = _._getMapEventDraggable(true);
    _.properties.map.event.dblclickZoom = _._getMapEventControlClickZoom(true);
    _.properties.map.event.scrollwheel = _._getMapEventScrollWheel(false);
  };
  /**
    Return google maps api key
    @request {string} [key=AIzaSyAiKl_QPZ8L92aLRfpH23F5jzEuIETEhWw]
    @returns {string}
  */
  Gmaps.prototype._getMapApiKey = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-key");
    try {
      _by_setting = _.settings.api.key;
    } catch (e) {}
    if (typeof _by_attr === "string") {
      _return = _by_attr;
    } else if (typeof _by_setting === "string") {
      _return = _.settings.api.key;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  /**
    Return map language
    @request {string} [lang=es]
    @returns {string}
  */
  Gmaps.prototype._getMapApiLanguage = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-lang"),
      _by_html = $('html').attr("lang");
    try {
      _by_setting = _.settings.api.lang;
    } catch (e) {}
    if (typeof _by_attr === "string") {
      _return = _by_attr;
    } else if (typeof _by_setting === "string") {
      _return = _.settings.api.lang;
    } else if (typeof _by_html === "string") {
      _return = _by_html;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  /**
    Return map zoom
    @request {integer} [zoom=4]
    @returns {string}
  */
  Gmaps.prototype._getMapOptionZoom = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = parseInt(_.$map.attr("data-zoom"));
    try {
      _by_setting = parseInt(_.settings.map.zoom);
    } catch (e) {}
    if (typeof _by_attr === "number" && _by_attr > 0) {
      _return = _by_attr;
    } else if (typeof _by_setting === "number" && _by_setting > 0) {
      _return = _.settings.map.zoom;
    } else {
      _return = _by_default;
    }
    if (_return > 0 && _return < 17) {
      _return = _by_default;
    }
    return _return;
  };
  /**
    Return map zoom min
    @request {integer} [zoom=1]
    @returns {integer}
  */
  Gmaps.prototype._getMapOptionZoomMin = function(_default) {
    var _ = this;
    var _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = parseInt(_.$map.attr("data-zoom-min"));
    try {
      _by_setting = parseInt(_.settings.map.zoom_min);
    } catch (e) {}
    if (typeof _by_attr === "number" && _by_attr > 0) {
      _return = _by_attr;
    } else if (typeof _by_setting === "number" && _by_setting > 0) {
      _return = _by_setting;
    } else {
      _return = _by_default;
    }
    if (_return > 0 && _return < 17) {
      _return = _by_default;
    }
    return _return;
  };
  /**
    Return map zoom max
    @request {integer} [zoom-max=1]
    @returns {integer}
  */
  Gmaps.prototype._getMapOptionZoomMax = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = parseInt(_.$map.attr("data-zoom-max"));
    try {
      _by_setting = parseInt(_.settings.map.zoom_max);
    } catch (e) {}
    if (typeof _by_attr === "number" && _by_attr > 0) {
      _return = _by_attr;
    } else if (typeof _by_setting === "number" && _by_setting > 0) {
      _return = _by_setting;
    } else {
      _return = _by_default;
    }
    if (_return > 0 && _return < 17) {
      _return = _by_default;
    }
    return _return;
  };
  /**
    Return map type
    @request {string} [type='roadmap' || 'satellite' || 'hybrid' || 'terrain' ]
    @returns {string}
  */
  Gmaps.prototype._getMapOptionType = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-type");
    try {
      _by_setting = _.settings.map.type;
    } catch (e) {}
    if (typeof _by_attr === "string" && typeof _by_attr !== "undefined") {
      _return = _by_attr;
    } else if (typeof _by_setting === "string" && typeof _by_setting !== "undefined") {
      _return = _by_setting;
    } else {
      _return = _by_default;
    }
    if (_return !== "roadmap" || _return !== "satellite" || _return !== "hybrid" || _return !== "terrain") {
      _return = _default;
    }
    return _return;
  };
  /**
    Return if the map set clustering
    @request {boolean} [clustering=false]
    @returns {boolean}
  */
  Gmaps.prototype._getMapOptionClustering = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-clustering");
    try {
      _by_setting = _.settings.map.clustering;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _by_setting;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  /**
    Return if the map set control zoom
    @request {boolean} [control-zoom=false]
    @returns {boolean}
  */
  Gmaps.prototype._getMapControlZoom = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-zoom");
    try {
      _by_setting = _.settings.control.zoom;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
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
  Gmaps.prototype._getMapControlType = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-type");
    try {
      _by_setting = _.settings.control.type;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
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
  Gmaps.prototype._getMapControlScale = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-scale");
    try {
      _by_setting = _.settings.control.scale;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
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
  Gmaps.prototype._getMapControlStreetView = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-streetview");
    try {
      _by_setting = _.settings.control.streetview;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
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
  Gmaps.prototype._getMapControlRotate = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-rotate");
    try {
      _by_setting = _.settings.control.rotate;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
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
  Gmaps.prototype._getMapControlFullscreen = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-fullscreen");
    try {
      _by_setting = _.settings.control.fullscreen;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
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
  Gmaps.prototype._getMapEventControlClickZoom = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-event-dblclickzoom");
    try {
      _by_setting = _.settings.event.dblclickZoom;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _by_setting;
    } else {
      _return = _by_default;
    }
    if (_return === true) {
      _return = false;
    } else {
      _return = true;
    }
    return _return;
  };
  Gmaps.prototype._getMapEventDraggable = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-fullscreen");
    try {
      _by_setting = _.settings.control.fullscreen;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _by_setting;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  Gmaps.prototype._getMapEventScrollWheel = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-event-scrollwheel");
    try {
      _by_setting = _.settings.event.scrollwheel;
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _by_setting;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  Gmaps.prototype._getMapStyle = function(settings) {
    try {
      return settings.style;
    } catch (err) {
      return false;
    }
  };
  Gmaps.prototype.getLocations = function(element) {
    var _ = this;
    var $locations = $(element).find('.marker');
    var locations = [];
    $locations.each(function(i, marker) {
      var _lat = $(marker).attr('data-lat');
      var _lng = $(marker).attr('data-lng');
      var _uid = $(marker).attr('data-id');
      var marker = {
        'id': _.getMarkerID(_uid),
        'lat': _lat,
        'lng': _lng,
        'html': $(marker).html(),
        'icon': _.getMarkerIcon(marker),
        'draggable': _.getMarkerEventDraggable(marker),
      };
      locations.push(marker);
    });
    return locations;
  };
  Gmaps.prototype.mapInit = function() {
    var _ = this;
    var _opts = {};
    _opts.zoom = _.properties.map.option.zoom;
    _opts.minZoom = _.properties.map.option.zoom_min;
    _opts.maxZoom = _.properties.map.option.zoom_max;
    _opts.mapTypeId = _.properties.map.option.type;
    _opts.zoomControl = _.properties.map.control.zoom;
    _opts.mapTypeControl = _.properties.map.control.type;
    _opts.scaleControl = _.properties.map.control.scale;
    _opts.streetViewControl = _.properties.map.control.streetview;
    _opts.rotateControl = _.properties.map.control.rotate;
    _opts.fullscreenControl = _.properties.map.control.fullscreen;
    _opts.draggable = _.properties.map.event.draggable;
    _opts.disableDoubleClickZoom = _.properties.map.event.dblclickZoom;
    _opts.scrollwheel = _.properties.map.event.scrollwheel;
    _.$map.addClass('googlemap')
      .addClass('googlemap-load');
    if (_.properties.map.style !== false) {
      _opts.styles = _.properties.map.style;
    }
    _.map = new google.maps.Map(_.$canvas.get(0), _opts);
    $.each(_.locations, function(index, value) {
      _.addMarker(value);
    });
    _.$map.trigger('onLoad');
    _.setCenter();
    if (_.properties.map.option.clustering) {
      var markerCluster = new MarkerClusterer(_.map, _.markers, {
        imagePath: '//developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }
  };
  Gmaps.prototype.getMarkerID = function(_default) {
    var _ = this,
      _value = _default,
      _return;
    if (_value === undefined) {
      _return = _.___createId(10);
    } else {
      _return = _.___slugify(_value);
    }
    return _return;
  }
  Gmaps.prototype.getMarkerIcon = function(element) {
    var _image = $(element).attr('data-marker-image');
    var _width = parseInt($(element).attr('data-marker-width'));
    var _height = parseInt($(element).attr('data-marker-height'));
    if (_image === undefined || !$.isNumeric(_width) || !$.isNumeric(_height)) {
      return false;
    }
    var icon = {
      url: _image,
      width: _width,
      height: _height
    };
    return icon;
  };
  Gmaps.prototype.getMarkerEventDraggable = function(element) {
    var _setting = Boolean($(element).attr('data-draggable'));
    if (_setting === undefined || _setting === "") {
      _setting = false;
    }
    return _setting;
  };
  Gmaps.prototype.getMarkerEventClickeable = function(element) {
    var _setting = Boolean($(element).attr('data-clickeable'));
    if (_setting === undefined || _setting === "") {
      _setting = false;
    }
    return _setting;
  };
  Gmaps.prototype.addMarker = function(settings) {
    var gmap = this;
    var options = {};
    options.id = settings.id
    options.position = new google.maps.LatLng(settings.lat, settings.lng);
    options.map = gmap.map;
    options.clickable = true;
    options.animation = google.maps.Animation.DROP;
    if (settings.icon !== false) {
      options.icon = settings.icon;
      var icon = {
        url: settings.icon.url,
        size: new google.maps.Size(settings.icon.width, settings.icon.height)
      };
    }
    if (settings.draggable !== false) {
      options.draggable = true;
    }
    var marker = new google.maps.Marker(options);
    gmap.markers.push(marker);
    var infowindow = new google.maps.InfoWindow({
      content: settings.html
    });
    gmap.infowindows.push(infowindow);
    marker.addListener('click', function() {
      $.each(gmap.infowindows, function(index, object) {
        object.close();
      });
      infowindow.open(gmap.map, marker);
      gmap.map.setCenter(this.getPosition());
      var _position = {};
      _position.lat = parseFloat(marker.getPosition().lat());
      _position.lng = parseFloat(marker.getPosition().lng());
      gmap.$map.trigger('onMarkerClick', [_position, settings.id]);
    });
    gmap.map.setCenter(options.position);
  }
  Gmaps.prototype.openMarker = function(id) {
    var _ = this;
    $.each(_.markers, function(index, marker) {
      if (marker.id === id) {
        new google.maps.event.trigger(marker, 'click');
      }
    });
  };
  Gmaps.prototype.setCenter = function() {
    var gmap = this;
    var bounds = new google.maps.LatLngBounds();
    $.each(gmap.locations, function(index, value) {
      var latlng = new google.maps.LatLng(value.lat, value.lng);
      bounds.extend(latlng);
    });
    if (gmap.locations.length === 1) {
      gmap.map.setCenter(bounds.getCenter());
    } else {
      gmap.map.fitBounds(bounds);
    }
  }
  Gmaps.prototype.reload = function() {
    var _ = this;
    _._init(_.element);
  };
  Gmaps.prototype.destroy = function() {
  };
  Gmaps.prototype.___getLatLng = function(_latitude, _longitude) {
    var _return = new google.maps.LatLng(_latitude, _longitude);
    return _return;
  };
  Gmaps.prototype.___slugify = function(_string) {
    return _string.toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
  Gmaps.prototype.___createId = function(lenght) {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var _return = '';
    for (var i = 0; i < lenght; i++) {
      var _rnd = Math.floor(Math.random() * charset.length);
      _return += charset.substring(_rnd, _rnd + 1);
    }
    return _return.toLowerCase();
  };
  Gmaps.prototype.___log = function(lenght) {
  };
  $.fn.gmaps = function() {
    var _gmaps = this;
    var _opt = arguments[0];
    var _args = Array.prototype.slice.call(arguments, 1);
    var _length = _gmaps.length;
    var i;
    var _return;
    for (i = 0; i < _length; i++) {
      if (typeof _opt == 'object' || typeof _opt == 'undefined')
        _gmaps[i].gmap = new Gmaps(_gmaps[i], _opt, i);
      else
        _return = _gmaps[i].gmap[_opt].apply(_gmaps[i].gmap, _args);
      if (typeof _return != 'undefined') return _return;
    }
    return _gmaps;
  };
}(jQuery));