'use strict';

/* Перетаскивание метки */
(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var movePinHandler = function (evt) {
    evt.preventDefault();

    var target = evt.target.closest('.map__pin--main');

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      var leftCoordinate = target.offsetLeft - shift.x;
      var topCoordinate = target.offsetTop - shift.y;
      var mapWidth = document.querySelector('.map__pins').clientWidth;
      var mapHeight = document.querySelector('.map__pins').clientHeight;
      if (window.tools.limitsPosition({width: mapWidth, height: mapHeight}, {left: leftCoordinate, top: topCoordinate})) {
        return;
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      target.style.left = (target.offsetLeft - shift.x) + 'px';
      target.style.top = (target.offsetTop - shift.y) + 'px';

      adForm.address.value = window.tools.getAddress({
        left: target.style.left,
        width: mainPin.offsetWidth,
        top: target.style.top,
        height: mainPin.offsetHeight,
        delta: 22
      });
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
  window.map = {
    activationPinMove: function (elem) {
      elem.addEventListener('mousedown', movePinHandler);
    }
  };
})();
