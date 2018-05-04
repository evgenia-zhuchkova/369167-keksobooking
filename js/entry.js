'use strict';

(function () {
  var LIMIT_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var ACTIVE_CHOICE = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var adForm = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var formFields = Array.from(adForm.elements);
  var pinsContainer = map.querySelector('.map__pins');

  var loadData = new Event('loadData', {bubbles: true, cancelable: true});

  var deactivatePage = function () {
    adForm.address.value = window.tools.getAddress({
      element: mainPin,
      left: mainPin.style.left,
      width: mainPin.offsetWidth,
      top: mainPin.style.top,
      height: mainPin.offsetHeight / 2,
      delta: 0
    });
    formFields.forEach(function (item) {
      item.disabled = true;
    });
  };

  var activePageHandler = function () {
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    formFields.forEach(function (item) {
      item.disabled = false;
      item.parentElement.style.position = 'relative';
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

  var loadDataHandler = function () {
    mainPin.addEventListener('mouseup', activePageHandler);
    document.removeEventListener('loadData', loadDataHandler);
    window.map.activationPinMove(mainPin);
  };

  window.tools.ajax({
    url: 'https://js.dump.academy/keksobooking/data',
    type: 'json',
    success: function (data) {
      window.data.set(data);
      document.dispatchEvent(loadData);
    },
    sendError: window.error.show

  });

  document.addEventListener('DOMContentLoaded', function () {
    adForm.address.readOnly = true;
    deactivatePage();
    document.addEventListener('loadData', loadDataHandler);
    window.tools.synchronizeFields('change', adForm.type, adForm.price, function () {
      adForm.price.placeholder = LIMIT_PRICE[adForm.type.value];
    });
    window.tools.synchronizeFields('change', adForm.timein, adForm.timeout, function () {
      adForm.timeout.selectedIndex = adForm.timein.selectedIndex;
    });
    window.tools.synchronizeFields('change', adForm.timeout, adForm.timein, function () {
      adForm.timein.selectedIndex = adForm.timeout.selectedIndex;
    });
    window.tools.synchronizeFields('change', adForm.rooms, adForm.capacity, function (param1, param2) {
      var value = parseInt(param1.value, 10);
      var options = param2.options;
      var optionsLength = options.length;
      var availableOptions = ACTIVE_CHOICE[value];
      var curValue = null;

      for (var i = 0; i < optionsLength; i++) {
        curValue = parseInt(options[i].value, 10);
        if (availableOptions.indexOf(curValue) !== -1) {
          options[i].disabled = false;
          if (curValue === value || availableOptions.length === 1) {
            options[i].selected = true;
          }
        } else {
          options[i].disabled = true;
        }
      }
    });
  });  
})();
