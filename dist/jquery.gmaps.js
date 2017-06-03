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
      _.config = []
      _.config.map = []
      _.config.map.api = []
      _.config.map.options = []
      _.config.map.controls = []
      _.config.map.events = []
      _.locations = _.getLocations(_.element);
      _._init(_.element);
    }
    return Gmaps;
  }());
  Gmaps.prototype._init = function(element) {
    var _ = this;
    _._getMapConfiguration();
    _._canvas(element);
    _._scripts();
  }
  Gmaps.prototype._canvas = function(element) {
    var _ = this;
    if (_.$map.find('.googlemap-overview').length > 0) {
      _.$map.find('.googlemap-overview').remove();
    }
    var _googlemap = document.createElement('div');
    $(_googlemap).addClass('googlemap-overview');
    $(_googlemap).addClass(_.id);
    $(element).prepend($(_googlemap));
    return _.$canvas = $(_googlemap);
  };
  Gmaps.prototype._scripts = function() {
    var _ = this;
    if ($('#gmaps-api').length === 0) {
      var _api = "//maps.googleapis.com/maps/api/js";
      _api += '?key=' + _.config.map.api.key;
      _api += '&language=' + _.config.map.api.lang;
      var api = document.createElement('script');
      api.type = 'text/javascript';
      api.src = _api;
      api.id = 'gmaps-api';
      api.async = true;
      api.defer = true;
      document.body.appendChild(api);
      if (_.config.map.options.clustering) {
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
  Gmaps.prototype._getMapConfiguration = function() {
    var _ = this;
    _.config.map.style = _._getMapStyle(_.settings);
    _.config.map.api.key = _._getMapApiKey(undefined);
    _.config.map.api.lang = _._getMapApiLanguage("en");
    _.config.map.options.zoom = _._getMapOptionZoom(4);
    _.config.map.options.zoom_min = _._getMapOptionZoomMin(1);
    _.config.map.options.zoom_max = _._getMapOptionZoomMax(16);
    _.config.map.options.type = _._getMapOptionType('roadmap');
    _.config.map.options.clustering = _._getMapOptionClustering(false);
    _.config.map.controls.zoom = _._getMapControlZoom(false);
    _.config.map.controls.type = _._getMapControlType(false);
    _.config.map.controls.scale = _._getMapControlScale(false);
    _.config.map.controls.streetView = _._getMapControlStreetView(false);
    _.controlRotate = _._getMapControlRotate(_.element);
    _.controlFullscreen = _._getMapControlFullscreen(_.element);
    _.eventDraggable = _._getMapEventDraggable(_.element);
    _.eventDoubleClickZoom = _._getMapEventDoubleClickZoom(_.element);
    _.eventMouseWheel = _._getMapEventMouseWheel(_.element);
  };
  /**
    Return google maps api key
    @request {string} [key=AIzaSyAiKl_QPZ8L92aLRfpH23F5jzEuIETEhWw]
  */
  Gmaps.prototype._getMapApiKey = function(_default) {
    var _ = this,
      _return,
      _by__default = _default,
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
      _return = _by__default;
    }
    return _return;
  };
  /**
    Return map language
    @request {string} [lang=es]
  */
  Gmaps.prototype._getMapApiLanguage = function(_default) {
    var _ = this,
      _return,
      _by__default = _default,
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
      _return = _by__default;
    }
    return _return;
  };
  /**
    Return map zoom
    @request {integer} [zoom=4]
  */
  Gmaps.prototype._getMapOptionZoom = function(_default) {
    var _ = this,
      _return,
      _by__default = _default,
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
      _return = _by__default;
    }
    if (_return <= 0 || _return >= 17) {
      _return = _by__default;
    }
    return _return;
  };
  /**
    Return map zoom min
    @request {integer} [zoom=1]
  */
  Gmaps.prototype._getMapOptionZoomMin = function(_default) {
    var _ = this;
    var _return,
      _by__default = _default,
      _by_setting = null,
      _by_attr = parseInt(_.$map.attr("data-zoom-min"));
    try {
      _by_setting = parseInt(_.settings.map.zoom_min);
    } catch (e) {}
    if (typeof _by_attr === "number" && _by_attr > 0) {
      _return = _by_attr;
    } else if (typeof _by_setting === "number" && _by_setting > 0) {
      _return = _.settings.map.zoom;
    } else {
      _return = _by__default;
    }
    if (_return <= 0 || _return >= 17) {
      _return = _by__default;
    }
    return _return;
  };
  /**
    Return map zoom max
    @request {integer} [zoom-max=1]
  */
  Gmaps.prototype._getMapOptionZoomMax = function(_default) {
    var _ = this,
      _return,
      _by__default = _default,
      _by_setting = null,
      _by_attr = parseInt(_.$map.attr("data-zoom-max"));
    try {
      _by_setting = parseInt(_.settings.map.zoom_max);
    } catch (e) {}
    if (typeof _by_attr === "number" && _by_attr > 0) {
      _return = _by_attr;
    } else if (typeof _by_setting === "number" && _by_setting > 0) {
      _return = _.settings.map.zoom;
    } else {
      _return = _by__default;
    }
    if (_return <= 0 || _return >= 17) {
      _return = _by__default;
    }
    return _return;
  };
  /**
    Return map type
    @request {string} [type='roadmap' || 'satellite' || 'hybrid' || 'terrain' ]
  */
  Gmaps.prototype._getMapOptionType = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-type");
    try {
      _by_setting = parseInt(_.settings.map.type);
    } catch (e) {}
    if (typeof _by_attr === "string" && typeof _by_attr !== "undefined") {
      _return = _by_attr;
    } else if (typeof _by_setting === "string" && typeof _by_setting !== "undefined") {
      _return = _.settings.map.zoom;
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
    @request {Boolean} [clustering=false]
  */
  Gmaps.prototype._getMapOptionClustering = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-clustering");
    try {
      _by_setting = parseInt(_.settings.map.clustering);
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _.settings.map.clustering;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  Gmaps.prototype._getMapControlZoom = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-zoom");
    try {
      _by_setting = parseInt(_.settings.control.zoom);
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _.settings.control.zoom;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  Gmaps.prototype._getMapControlType = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-type");
    try {
      _by_setting = parseInt(_.settings.control.type);
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _.settings.control.type;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  Gmaps.prototype._getMapControlScale = function(_default) {
    var _ = this,
      _return,
      _by_default = _default,
      _by_setting = null,
      _by_attr = _.$map.attr("data-control-scale");
    try {
      _by_setting = parseInt(_.settings.control.scale);
    } catch (e) {}
    if (typeof _by_attr === "boolean" && (typeof _by_attr !== "true" || typeof _by_attr !== "false")) {
      _return = _by_attr;
    } else if (typeof _by_setting === "boolean" && (typeof _by_setting !== "true" || typeof _by_setting !== "false")) {
      _return = _.settings.control.scale;
    } else {
      _return = _by_default;
    }
    return _return;
  };
  Gmaps.prototype._getMapControlStreetView = function(element) {
    var _ = this;
    var _attr = $(element).attr('data-control-streetview');
    return _.___getBoolean(_attr, false);
  };
  Gmaps.prototype._getMapControlRotate = function(element) {
    var _ = this;
    var _attr = $(element).attr('data-control-rotate');
    return _.___getBoolean(_attr, false);
  };
  Gmaps.prototype._getMapControlFullscreen = function(element) {
    var _ = this;
    var _attr = $(element).attr('data-control-fullscreen');
    return _.___getBoolean(_attr, false);
  };
  Gmaps.prototype._getMapEventDraggable = function(element) {
    var _ = this;
    var _attr = $(element).attr('data-event-draggable');
    return _.___getBoolean(_attr, true);
  };
  Gmaps.prototype._getMapEventDoubleClickZoom = function(element) {
    var _ = this;
    var _attr = $(element).attr('data-event-doubleclick');
    var _return = _.___getBoolean(_attr, true);
    if (_return === false) {
      _return = true;
    } else {
      _return = false;
    }
    return _return;
  };
  Gmaps.prototype._getMapEventMouseWheel = function(element) {
    var _ = this;
    var _attr = $(element).attr('data-event-mousewheel');
    return _.___getBoolean(_attr, false);
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
      var marker = {
        'id': _.getMarkerID(marker),
        'lat': $(marker).attr('data-lat'),
        'lng': $(marker).attr('data-lng'),
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
    _opts.zoom = _.config.map.options.zoom;
    _opts.minZoom = _.config.map.options.zoom_min;
    _opts.maxZoom = _.config.map.options.zoom_max;
    _opts.mapTypeId = _.config.map.options.type;
    _opts.zoomControl = _.config.map.controls.zoom;
    _opts.mapTypeControl = _.config.map.controls.type;
    _opts.scaleControl = _.config.map.controls.scale;
    _opts.streetViewControl = _.config.map.controls.streetView;
    _opts.rotateControl = _.controlRotate;
    _opts.fullscreenControl = _.controlFullscreen;
    _opts.draggable = _.eventDraggable;
    _opts.disableDoubleClickZoom = _.eventDoubleClickZoom;
    _opts.scrollwheel = _.eventMouseWheel;
    console.log(_);
    _.$map.addClass('googlemap')
      .addClass('googlemap-load');
    if (_.config.map.style !== false) {
      _opts.styles = _.config.map.style;
    }
    _.map = new google.maps.Map(_.$canvas.get(0), _opts);
    $.each(_.locations, function(index, value) {
      _.addMarker(value);
    });
    _.$map.trigger('onLoad');
    _.setCenter();
    if (_.config.map.options.clustering) {
      var markerCluster = new MarkerClusterer(_.map, _.markers, {
        imagePath: '//developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }
  };
  Gmaps.prototype.getMarkerID = function(element) {
    var _ = this;
    var _attr = $(element).attr('data-id');
    if (_attr === undefined) {
      _attr = _.___randomId(10);
    } else {
      _attr = _.___slugify(_attr);
    }
    return _attr;
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
  Gmaps.prototype.___getBoolean = function(_value, __default) {
    var _ret = __default;
    if (_value === "true") {
      _ret = true;
    } else if (_value === "false") {
      _ret = false;
    }
    return _ret;
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
  Gmaps.prototype.___randomId = function(lenght) {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var _return = '';
    for (var i = 0; i < lenght; i++) {
      var _rnd = Math.floor(Math.random() * charset.length);
      _return += charset.substring(_rnd, _rnd + 1);
    }
    return _return.toLowerCase();
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