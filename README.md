# jQuery Google Maps

[![npm version](https://badge.fury.io/js/jquery-gmaps.svg)](https://badge.fury.io/js/jquery-gmaps)

### What is jquery gMaps?

jQuery gMaps is intended to reduce the time of frontend development. You can create maps customized with html attributes and some lines of javascript.

### Example

See an example on: https://codepen.io/jesusgoku/full/mjRdqy

### Installation

#### Package manager

```shell
# $ yarn add jquery-gmaps
$ npm install jquery-gmaps --save-dev
```

#### Browser

```html
<head>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script src="https://unpkg.com/jquery-gmaps/dist/jquery.gmaps.min.js"></script>

  <link rel="stylesheets" type="text/css" href="https://unpkg.com/jquery-gmaps/dist/jquery.gmaps.min.css">
</head>
```

### Get Google Maps API Key

See instructions on: https://developers.google.com/maps/documentation/javascript/get-api-key

### Usage

#### Webpack

```js
  require('jquery-gmaps');
  require('jquery-gmaps/dist/jquery.gmaps.min.css');
```

#### jQuery

```js
  $(document).ready(function(){
    $('.gmaps').gmaps();
  });
```

### HTML

```html
<div
  data-key="[YOUR API KEY]"
  data-zoom="4"
  role="map"
  class="gmaps">

  <div
    data-id="chile"
    data-lat="-35.675147"
    data-lng="-71.542969"
    class="marker">

    <div class="marker-card">
      <h2>Chile</h2>
    </div>

  </div>

  <div
    data-id="argentina"
    data-lat="-38.416097"
    data-lng="-63.616672"
    class="marker">

    <div class="marker-card">
      <h2>Argentina</h2>
    </div>

  </div>

  <div
    data-id="brasil"
    data-lat="-14.235004"
    data-lng="-51.92528"
    class="marker">

    <div class="marker-card">
      <h2>Brasil</h2>
    </div>

  </div>

  <div
    data-id="peru"
    data-lat="-9.189967"
    data-lng="-75.015152"
    class="marker">

    <div class="marker-card">
      <h2>Perú</h2>
    </div>

  </div>

</div>
```

### Options

#### Map options

| Attribute  | Type | Values | Default | Explanation |
|-|-|-|-|-|
| data-key | String | -- | required | You can get your api key [here](https://developers.google.com/maps/documentation/javascript/get-api-key).  |
| data-zoom | Integer | -- | 4 | Sets the initial map zoom |
| data-clustering | Boolean | true or false | false | Group the map markers |

#### Map controls

| Attribute  | Type | Values | Default | Explanation |
|-|-|-|-|-|
| data-control-zoom | Boolean | true or false | false | -- |
| data-control-type | Boolean | true or false | false | -- |
| data-control-scale | Boolean | true or false | false | -- |
| data-control-streetview | Boolean | true or false | false | -- |
| data-control-rotate | Boolean | true or false | false | -- |
| data-control-fullscreen | Boolean | true or false | false | -- |

#### Map events

| Attribute  | Type | Values | Default | Explanation |
|-|-|-|-|-|
| data-event-draggable | Boolean | true or false | true | -- |
| data-event-doubleclick | Boolean | true or false | true | -- |
| data-event-mousewheel | Boolean | true or false | false | -- |

#### Marker options

| Attribute  | Type | Values | Default | Explanation |
|-|-|-|-|-|
| data-id | String | -- | required | Unique ID for marker |
| data-lat | Floating | -- | required | Latitude for marker |
| data-lng | Floating | -- | required | Longitude for marker |
