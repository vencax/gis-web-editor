
angular.module("app")

.controller('HomeCtrl', function($scope, $rootScope, $location, $window, MapsSrvc, PolyEditSrvc) {

  var krovakCode = 'EPSG:5514';

  var krovak = new ol.proj.Projection({
    code: krovakCode,
    // The extent is used to determine zoom level 0. Recommended values for a
    // projection's validity extent can be found at http://epsg.io/.
    // extent: krovakBox,
    units: 'm'
  });
  ol.proj.addProjection(krovak);

  var krovakview = new ol.View({
    projection: krovak,
    center: [-739162.6601787216,-1115065.7464216047],
    zoom: 15
  });

  // ---------- layers -----------

  var source = new ol.source.Vector();

  var vectorLayer = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 1,
        color: [255, 0, 0, 1]
      }),
      fill: new ol.style.Fill({
        color: [0, 0, 255, 0.4]
      })
    })
  });

  var ortofoto = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      params: {
        'LAYERS': 'GR_ORTFOTORGB',
      },
      url: 'http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/service.svc/get'
    }),
    opacity: 0.7
  });

  // ---------- interactions ----------

  var select = new ol.interaction.Select();

  var modify = new ol.interaction.Modify({
    features: select.getFeatures()
  });

  // ---------- map ----------

  $scope.editor = {};

  var info = new ol.dom.Input(document.getElementById('info'));
  info.bindTo('value', krovakview, 'center');

  var map = new ol.Map({
    interactions: ol.interaction.defaults().extend([select, modify]),
    layers: [ortofoto, vectorLayer],
    target: 'map',
    view: krovakview
  });

  map.on('singleclick', function(clickEvt) {
    // when a feature is selected...
    var ftrs = select.getFeatures();
    // setup  add and remove from selection handlers
    PolyEditSrvc.onMapClick(ftrs, $scope.editor, function() {
      $scope.$digest();
    });
  });

  MapsSrvc.getFeatures(source);

});
