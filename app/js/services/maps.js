
angular.module("app")

.factory('MapsSrvc', function($http) {

  return {

    getFeatures: function(source) {
      $http.get('/api/state').success(function(geoms) {
        geoms.forEach(function(geometry, idx) {
          var poly = new ol.geom.Polygon([geometry]);
          var feature = new ol.Feature({
            geometry: poly,
            name: idx
          });
          source.addFeature(feature);
        });
      });
    }

  };
});
