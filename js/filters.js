'use strict';

(function () {
  var filteredList = [];
  var filterContainer = document.querySelector('.tokyo__filters-container');
  var filterHousing = filterContainer.querySelector('#housing_type');
  var filterPrice = filterContainer.querySelector('#housing_price');
  var filterRoomNumber = filterContainer.querySelector('#housing_room-number');
  var filterGuestsNumber = filterContainer.querySelector('#housing_guests-number');
  var filterFeatures = filterContainer.querySelector('#housing_features');

  var filterList = [
    // Takes ONE object, returns true / false
    function priceFilter(data) {
      var filterPriceValue = filterPrice.value;
      if (filterPriceValue === 'middle') {
        return data.offer.price > 10000 && data.offer.price < 50000;
      } else if (filterPriceValue === 'low') {
        return data.offer.price < 10000;
      } else {
        return data.offer.price > 50000;
      }
    },
    function roomNumberFilter(data) {
      var filterRoomNumberValue = filterRoomNumber.value;
      if (filterRoomNumberValue === '1') {
        return data.offer.rooms === 1;
      } else if (filterRoomNumberValue === '2') {
        return data.offer.rooms === 2;
      } else if (filterRoomNumberValue === '3') {
        return data.offer.rooms === 3;
      } else {
        return true;
      }
    },
    // ...
    // And so on...
    // ...
  ];

  function filterAllFields(data) {
    for (var i = 0; i < filterList.length; ++i) {
      var filter = filterList[i];
      if (!filter(data)) {
        return false;
      }
    }
    return true;
  }

  window.filter = function (offerList) {
    return offerList.filter(filterAllFields);
  };
})();
