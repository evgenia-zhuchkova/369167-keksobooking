'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 1000;
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
  var filterForm = document.querySelector('.map__filters');
  var lastTimeout = null;
  var loadData = new Event('loadData', {bubbles: true, cancelable: true});

  var startPinCoord = {
    left: mainPin.style.left,
    top: mainPin.style.top
  };

  var changeEvent = new Event('change');
  var resetField = function (field, selectedIndex) {
    field.selectedIndex = selectedIndex;
    field.dispatchEvent(changeEvent);
  };

  var deactivatePage = function () {
    if(!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }
    if(!adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.add('ad-form--disabled');
    }
    if(window.ad.getRenderedPins().length) {
      window.ad.getRenderedPins().forEach(function (item) {
        item.remove();
      });
      window.ad.closeAd();
    }
    adForm.title.value = '';
    adForm.price.value = '';
    resetField(adForm.type, 0);
    resetField(adForm.rooms, 2);
    resetField(adForm.timein, 0);
    mainPin.style.left = startPinCoord.left;
    mainPin.style.top = startPinCoord.top;
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
    mainPin.addEventListener('mouseup', activePageHandler);
  };

  var activePageHandler = function () {
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    formFields.forEach(function (item) {
      item.disabled = false;
      if(item.parentElement.style.position !== 'relative') {
        item.parentElement.style.position = 'relative';
      }
    });
    adForm.address.value = window.tools.getAddress({
      element: mainPin,
      left: mainPin.style.left,
      width: mainPin.offsetWidth,
      top: mainPin.style.top,
      height: mainPin.offsetHeight,
      delta: parseInt(getComputedStyle(mainPin, ':after').borderTopWidth, 10)
    });
    window.ad.renderPins(window.data.get(), pinsContainer);
    mainPin.removeEventListener('mouseup', activePageHandler);
  };

  var loadDataHandler = function () {
    document.removeEventListener('loadData', loadDataHandler);
    window.map.activationPinMove(mainPin);
    window.filters.init(window.data.get(), filterForm, function (data) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        window.ad.renderPins(data, pinsContainer);
      }, DEBOUNCE_INTERVAL);
    });
    adForm.addEventListener('submit', window.form.initSubmitHandler(deactivatePage));
    adForm.addEventListener('reset', function (evt) {
    evt.preventDefault();
      window.scrollTo(0, 0);
      deactivatePage();
    });
  };

  window.tools.ajax({
    url: 'https://js.dump.academy/keksobooking/data',
    type: 'json',
    successHandler: function (data) {
      window.data.set(data);
      document.dispatchEvent(loadData);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    adForm.address.readOnly = true;
    deactivatePage();
    document.addEventListener('loadData', loadDataHandler);
    window.tools.synchronizeFields('change', adForm.type, function () {
      adForm.price.placeholder = LIMIT_PRICE[adForm.type.value];
    });
    window.tools.synchronizeFields('change', adForm.timein, function () {
      adForm.timeout.selectedIndex = adForm.timein.selectedIndex;
    });
    window.tools.synchronizeFields('change', adForm.timeout, function () {
      adForm.timein.selectedIndex = adForm.timeout.selectedIndex;
    });
    window.tools.synchronizeFields('change', adForm.rooms, function () {
      var value = parseInt(adForm.rooms.value, 10);
      var options = adForm.capacity.options;
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
