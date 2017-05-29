# jQuery Google Maps

## Installation

#### NPM

```
npm install jquery-gmaps --save-dev
```

#### Webpack

```js
require('jquery-gmaps');
```

#### jQuery

```js
$(document).ready(function(){
  $('#map').gmaps();
});
```

#### HTML

```html
<div
  data-key="AIzaSyAiKl_QPZ8L92aLRfpH23F5jzEuIETEhWw"
  data-lang="es"
  data-zoom="4"

  data-pin-icon=""
  data-pin-width=""
  data-pin-height=""

  role="map"
  id="map">
    
    <div
      data-lat="-25.363"
      data-lng="131.044" 
      class="marker">
    </div>

    <div
      data-lat="-28.383"
      data-lng="132.084" 
      class="marker">
    </div>

    <div
      data-lat="-30.383"
      data-lng="138.084" 
      class="marker">
    </div>

</div>
```
