;
(function(factory) {
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
    function Gmaps(element, settings, index) {
      var _ = this;
      _.element = element;
      _.settings = settings;
      _.$map = $(element);
      _.index = index;
      _.id = 'jquery-gmaps-' + index;
      _.getMapSettings();
      _._canvas(element);
      _._scripts();
    }
    return Gmaps;
  }());
  Gmaps.prototype._canvas = function(element) {
    var _ = this;
    var _googlemap = document.createElement('div');
    $(_googlemap).addClass('googlemap-overview');
    $(_googlemap).addClass(_.id);
    return $(element).prepend($(_googlemap));
  };
  Gmaps.prototype._scripts = function() {
    var gmap = this;
    if (gmap.index == 0) {
      var _api = "https://maps.googleapis.com/maps/api/js";
      if (gmap.key) {
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
      if (gmap.clustering) {
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
    var loading = setInterval(function() {
      if (window.google !== undefined) {
        window.clearInterval(loading);
        gmap.mapInit();
      }
    }, 200);
  };
  Gmaps.prototype.getMapSettings = function() {
    var _ = this;
    _.map = null;
    _.markers = [];
    _.bounds = null;
    _.infowindows = [];
    _.key = _.getMapKey(_.element);
    _.zoom = _.getMapZoom(_.element);
    _.clustering = _.getMapClustering(_.element);
    _.lang = _.getMapLanguage();
    _.draggable = _.getMapDraggable(_.element);
    _.style = _.getMapStyle(_.settings);
    _.zoomControl = _.getMapZoomControl(_.element);
    _.typeControl = _.getMapTypeControl(_.element);
    _.scaleControl = _.getMapScaleControl(_.element);
    _.streetViewControl = _.getMapStreetViewControl(_.element);
    _.rotateControl = _.getMapRotateControl(_.element);
    _.fullscreenControl = _.getMapFullscreenControl(_.element);
    _.locations = _.getLocations(_.element);
  };
  Gmaps.prototype.getMapLanguage = function() {
    var $html = $('html');
    var _setting = $html.attr('lang');
    if (_setting === undefined || _setting === "") {
      _setting = "en";
    }
    return _setting;
  };
  Gmaps.prototype.getMapStyle = function(settings) {
    try {
      return settings.style;
    } catch (err) {
      return false;
    }
  };
  Gmaps.prototype.getMapKey = function(element) {
    var _attr = $(element).attr('data-key');
    return _attr;
  };
  Gmaps.prototype.getMapZoom = function(element) {
    var _attr = $(element).attr('data-zoom');
    if (typeof _attr !== typeof "undefined") {
      _attr = 4;
    } else {
      _attr = parseInt(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapZoomControl = function(element) {
    var _attr = $(element).attr('data-control-zoom');
    if (typeof _attr !== typeof "undefined") {
      _attr = false;
    } else {
      _attr = Boolean(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapTypeControl = function(element) {
    var _attr = $(element).attr('data-control-type');
    if (typeof _attr !== typeof "undefined") {
      _attr = false;
    } else {
      _attr = Boolean(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapScaleControl = function(element) {
    var _attr = $(element).attr('data-control-scale');
    if (typeof _attr !== typeof "undefined") {
      _attr = false;
    } else {
      _attr = Boolean(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapStreetViewControl = function(element) {
    var _attr = $(element).attr('data-control-streetview');
    if (typeof _attr !== typeof "undefined") {
      _attr = false;
    } else {
      _attr = Boolean(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapRotateControl = function(element) {
    var _attr = $(element).attr('data-control-rotate');
    if (typeof _attr !== typeof "undefined") {
      _attr = false;
    } else {
      _attr = Boolean(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapFullscreenControl = function(element) {
    var _attr = $(element).attr('data-control-fullscreen');
    if (typeof _attr !== typeof "undefined") {
      _attr = false;
    } else {
      _attr = Boolean(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapDraggable = function(element) {
    var _attr = $(element).attr('data-draggable');
    if (typeof _attr !== typeof "undefined") {
      _attr = true;
    } else {
      _attr = Boolean(_attr);
    }
    return _attr;
  };
  Gmaps.prototype.getMapClustering = function(element) {
    var _setting = Boolean($(element).attr('data-clustering'))
    if (_setting === undefined) {
      _setting = false;
    }
    return _setting;
  };
  Gmaps.prototype.mapInit = function() {
    var _ = this;
    var _opts = {};
    _opts.zoom = _.zoom;
    _opts.zoomControl = _.zoomControl;
    _opts.mapTypeControl = _.typeControl;
    _opts.scaleControl = _.scaleControl;
    _opts.streetViewControl = _.streetViewControl;
    _opts.rotateControl = _.rotateControl;
    _opts.fullscreenControl = _.fullscreenControl;
    _opts.draggable = _.draggable;
    _opts.disableDoubleClickZoom = false;
    _opts.scrollwheel = false;
    _.$map.addClass('googlemap')
      .addClass('googlemap-load');
    if (_.style !== false) {
      _opts.styles = _.style;
    }
    var $map = $("." + _.id);
    _.map = new google.maps.Map($map.get(0), _opts);
    $.each(_.locations, function(index, value) {
      _.addMarker(value);
    });
    _.$map.trigger('onLoad');
    _.setCenter();
    if (_.clustering) {
      var markerCluster = new MarkerClusterer(_.map, _.markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }
  };
  Gmaps.prototype.getLocations = function(element) {
    var _ = this;
    var $locations = $(element).find('.marker');
    var locations = [];
    $locations.each(function(i, el) {
      var marker = {
        'id': parseFloat($(el).attr('data-id')),
        'lat': parseFloat($(el).attr('data-lat')),
        'lng': parseFloat($(el).attr('data-lng')),
        'html': $(el).html(),
        'icon': _.getMarkerIcon(el),
        'draggable': _.getMarkerDraggable(el),
      };
      locations.push(marker);
    });
    console.log(locations);
    return locations;
  };
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
  Gmaps.prototype.getMarkerDraggable = function(element) {
    var _setting = Boolean($(element).attr('data-draggable'));
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
  Gmaps.prototype.reload = function() {};
  Gmaps.prototype.destroy = function() {};
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
}));