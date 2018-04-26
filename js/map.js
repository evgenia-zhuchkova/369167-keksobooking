'use strict';

/* Блокировка полей */
var disableFieldsets = function (flag) {
  for (var i = 0; i < window.data.fieldsets.length; i++) {
    window.data.fieldsets[i].disabled = flag;
  }
};

/* Определяет адрес метки */
var setAddress = function (x, y) {
  var adressInputField = document.querySelector('#address');
  adressInputField.value = x + ', ' + y;
};

/* Координаты метки после загрузки страницы */
var addCoordinate = function () {
  var labelPositionX = parseInt(parseInt(window.data.mapPinMain.style.left, 10) + window.data.MAIN_PIN_WIDTH / 2, 10);
  var labelPositionY = parseInt(parseInt(window.data.mapPinMain.style.top, 10) + window.data.MAIN_PIN_HEIGHT / 2, 10);
  setAddress(labelPositionX, labelPositionY);
};

addCoordinate();


/* Активация страницы */
var activatePage = function (activePosition) {
  var initialPositionX = parseInt(parseInt(window.data.mapPinMain.style.left, 10) + window.data.MAIN_PIN_WIDTH / 2, 10);
  var initialPositionY = parseInt(parseInt(window.data.mapPinMain.style.top, 10) + window.data.MAIN_PIN_HEIGHT + window.data.MAIN_PIN_TIP, 10);
  if (activePosition) {
    window.data.mapElements.classList.remove('map--faded');
    window.data.activeForm.classList.remove('ad-form--disabled');
  } else {
    window.data.mapElements.classList.add('map--faded');
    window.data.activeForm.classList.add('ad-form--disabled');
  }
  setAddress(initialPositionX, initialPositionY);
  disableFieldsets(!activePosition);
};

/* Переводит страницу в активное состояние и устанавливает значения поля ввода адреса */
var activePageHandler = function () {
  activatePage(true);
  window.pin.renderPins(window.offer.renderOffers(window.data.offerCount));
  window.data.mapPinMain.removeEventListener('mouseup', activePageHandler);
};

window.data.mapPinMain.addEventListener('mouseup', activePageHandler);

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === window.data.ESC_KEYCODE) {
    evt.preventDefault();
    window.offer.closeOffer();
  }
});

/* Перетаскивание метки */
window.data.mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

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
    var leftCoordinate = window.data.mapPinMain.offsetLeft - shift.x;
    var topCoordinate = window.data.mapPinMain.offsetTop - shift.y;
    var mapWidth = document.querySelector('.map__pins').clientWidth;
    var mapHeight = document.querySelector('.map__pins').clientHeight;
    if (window.tools.limitsPosition({width: mapWidth, height: mapHeight}, {left: leftCoordinate, top: topCoordinate})) {
      return false;
    }

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    window.data.mapPinMain.style.left = (window.data.mapPinMain.offsetLeft - shift.x) + 'px';
    window.data.mapPinMain.style.top = (window.data.mapPinMain.offsetTop - shift.y) + 'px';
    var currentPositionX = parseInt(parseInt(window.data.mapPinMain.style.left, 10) + window.data.MAIN_PIN_WIDTH / 2, 10);
    var currentPositionY = parseInt(parseInt(window.data.mapPinMain.style.top, 10) + window.data.MAIN_PIN_HEIGHT + window.data.MAIN_PIN_TIP, 10);
    setAddress(currentPositionX, currentPositionY);
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
});
