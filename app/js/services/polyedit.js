
angular.module("app")

.factory('PolyEditSrvc', function() {

  function onFeatureChange(evt) {

  }

  var lastGeom = [];
  var currPoint = null;

  function _pointsEqual(p1, p2) {
    return p1[0] !== p2[0] && p1[1] !== p2[1];
  }

  function _findChangedPoint(geom) {
    for(var i=0; i<geom.length; i++) {
      if(! _pointsEqual(geom[i], lastGeom[i])) {
        return i;
      }
    }
  }

  function _onGeometryChange(geometry, editor) {
    if( (currPoint === null) ||
        (currPoint && _pointsEqual(geometry[currPoint], lastGeom[currPoint]))) {
      editor.currentPoint = currPoint = _findChangedPoint(geometry);
    }
    if(geometry.length < lastGeom.length) {  // point delete
      editor.currentPoint = currPoint = null;
    }
    angular.copy(geometry, lastGeom);
  }

  return {

    onMapClick: function(ftrs, editor, cb) {
      ftrs.once('add', function(addEvt) {

        var feature = addEvt.element;

        // ...listen for changes on it
        feature.on('change', function(changeEvt) {
          onFeatureChange(changeEvt);
        });

        var geom = feature.getGeometry();

        geom.on('change', function(fchangeEvt) {
          _onGeometryChange(fchangeEvt.target.getCoordinates()[0], editor);
          cb();
        });

        angular.copy(geom.getCoordinates()[0], lastGeom);
        cb();
      });

      ftrs.once('remove', function(removeEvt) {
        editor.currentPoint = editor.currFeature = editor.currPolygon = null;
        currPoint = null;
        currGeometry = {};
        cb();
      });
    }

  };

});
