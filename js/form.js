'use strict';

(function () {
  
  
  /* синхронизация полей времени */
  var timeInField = document.getElementById('timein');
  var timeOutField = document.getElementById('timeout');

  timeInField.addEventListener('change', function () {
    timeOutField.value = timeInField.value;
  });

  timeOutField.addEventListener('change', function () {
    timeInField.value = timeOutField.value;
  });

  
  /* соответствие цены и типа жилья */
  
  var minPriceMessage;
  var priceInput = document.querySelector('.ad-form').elements.price;
  var selectType = document.querySelector('.ad-form').elements.type;
  var MIN_PRICES = [1000, 0, 5000, 10000];
  var APARTMENT_TYPES = ['квартира', 'лачуга', 'дом', 'дворец'];
  var syncValueMin = function (fields1, fields2, values1, values2) {
    for (var j = 0; j < fields1.length; j++) {
      if (fields1.selectedIndex === j) {
        fields2.value = values1[j];
        fields2.min = values1[j];
        minPriceMessage = values2[j] + ' ' + values1[j];
        break;
      }
    }
    return minPriceMessage;
  };
  window.tools.synchronizeFields(selectType, priceInput, MIN_PRICES, APARTMENT_TYPES, syncValueMin);

  /* соответствие комнат и количества гостей*/
  var selectRooms = document.querySelector('.ad-form').elements.rooms;
  var selectCapacity = document.querySelector('.ad-form').elements.capacity;
  var ACTIVE_CHOICE = [
    [2],
    [1, 2],
    [0, 1, 2],
    [3]
  ];
 var syncValuePersons = function (fields1, fields2) {
    for (var i = 0; i < fields2.length; i++) {
      fields2.options[i].disabled = true;
    }
    for (var j = 0; j < fields2.length; j++) {
      if (fields1.selectedIndex === j) {
        fields2.options[ACTIVE_CHOICE[j][0]].selected = true;
        for (var k = 0; k < ACTIVE_CHOICE[j].length; k++) {
          fields2.options[ACTIVE_CHOICE[j][k]].removeAttribute('disabled');
        }
      }
    }
  };
  
  window.tools.synchronizeFields(selectRooms, selectCapacity, '', '', syncValuePersons);



var MIN_LENGTH_TITLE = 30;
  var MAX_LENGTH_TITLE = 100;
  var MIN_PRICE = 0;
  var MAX_PRICE = 1000000;

 var sendError = function (evt) {
   var priceInput = document.querySelector('.ad-form').elements.price;
   var titleInput = document.querySelector('.ad-form').elements.title;
    if (titleInput.value.length < MIN_LENGTH_TITLE || titleInput.value.length > MAX_LENGTH_TITLE) {
      console.log('error');
      evt.preventDefault();
    }
    if (priceInput.min < MIN_PRICE || priceInput.max > MAX_PRICE || priceInput.type !== 'number' || priceInput.value === '') {
      console.log('error');
      evt.preventDefault();
    }
    evt.preventDefault();
  };

})();
