'use strict';

(function () {
  var MAX_DISPAYED_ADS = 8;

  var adForm = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var formFields = Array.from(adForm.elements);
  var pinsContainer = map.querySelector('.map__pins');


  var loadData = new Event('loadData', {bubbles: true, cancelable: true});


  var deactivatePage = function() {
    adForm.address.value = window.tools.getAddress({
      element: mainPin,
      left: mainPin.style.left,
      width: mainPin.offsetWidth,
      top: mainPin.style.top,
      height: mainPin.offsetHeight / 2,
      delta: 0
    });
    formFields.forEach(function(item) {
      item.disabled = true;
    });
  };

  var activePageHandler = function() {
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    formFields.forEach(function(item) {
      item.disabled = false;
    });
    adForm.address.value = window.tools.getAddress({
      element: mainPin,
      left: mainPin.style.left,
      width: mainPin.offsetWidth,
      top: mainPin.style.top,
      height: mainPin.offsetHeight,
      delta: 22
    });
    window.ad.renderPins(window.data.get(), pinsContainer);
    mainPin.removeEventListener('mouseup', activePageHandler);
  };

  var loadDataHandler = function(evt) {
    mainPin.addEventListener('mouseup', activePageHandler);
    document.removeEventListener('loadData', loadDataHandler);
    window.map.activationPinMove(mainPin);
  };

  window.tools.ajax({
    url: 'https://js.dump.academy/keksobooking/data',
    type: 'json',
    success: function(data) {
      console.log(data);
      window.data.set(data);
      document.dispatchEvent(loadData);
    },
    sendError: function() {
     // console.log('ошибка');
      
    }
  });


  document.addEventListener('DOMContentLoaded', function(evt) {
    adForm.address.readOnly = true;
    deactivatePage();
    document.addEventListener('loadData', loadDataHandler);
  });
})();
