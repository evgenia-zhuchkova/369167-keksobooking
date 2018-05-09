'use strict';

(function () {
  var MAX_PRICE = 50000;
  var MIN_PRICE = 10000;

  var selectCriteria = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false,
    features: []
  };
  var filtrate = function (field, item) {
    return selectCriteria[field] === 'any' ? true : selectCriteria[field] === item.offer[field];
  };

  var filtratePrice = function (item) {
    var result = true;

    if (selectCriteria.price !== 'any') {
      switch (selectCriteria.price) {
        case 'middle':
          result = item.offer.price >= MIN_PRICE && item.offer.price <= MAX_PRICE;
          break;
        case 'low':
          result = item.offer.price < MIN_PRICE;
          break;
        case 'high':
          result = item.offer.price > MAX_PRICE;
          break;
        default:
          break;
      }
    }
    return result;
  };

  var createSelectCriteria = function () {
    for (var key in selectCriteria) {
      if (selectCriteria.hasOwnProperty(key)) {
        if (typeof selectCriteria[key] === 'boolean') {
          if (selectCriteria[key]) {
            if (!selectCriteria.features.includes(key)) {
              selectCriteria.features.push(key);
            }
          } else {
            if (selectCriteria.features.includes(key)) {
              var index = selectCriteria.features.indexOf(key);
              selectCriteria.features.splice(index, 1);
            }
          }
        }
      }
    }
  };

  window.filters = {
    init: function (ads, elem, callback) {
      elem.addEventListener('change', function (event) {
        event.preventDefault();

        var filteredAds = [];
        var target = event.target;
        var filteredField = target.nodeName.toLowerCase() === 'input' ? target.value : target.id.slice(target.id.indexOf('-') + 1);
        var filteredValue = target.nodeName.toLowerCase() === 'input' ? target.checked : target.options[target.selectedIndex].value;

        selectCriteria[filteredField] = typeof filteredValue === 'boolean' || isNaN(filteredValue) ? filteredValue : parseInt(filteredValue, 10);
        createSelectCriteria();
        if (selectCriteria.features.length > 0) {
          ads.forEach(function (item) {
            var checkFeatures = window.tools.checkEntry(item.offer.features, selectCriteria.features);
            if (checkFeatures) {
              filteredAds.push(item);
            }
          });
        } else {
          filteredAds = ads.slice();
        }

        filteredAds = filteredAds.filter(function (item) {
          return filtrate('type', item) && filtrate('guests', item) && filtrate('rooms', item) && filtratePrice(item);
        });
        callback(filteredAds);
      });
    }
  };

})();
