'use strict';

(function () {
  var MAX_PRICE = 50000;
  var MIN_PRICE = 10000;

  var selectCriterion = {
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

  window.filters = {
    createFilters: function (data, elem, callback) {
      var filtrate = function (field, item) {
        var result = true;

        if (selectCriterion[field] !== 'any') {
          result = selectCriterion[field] === item.offer[field];
        }
        return result;
      };

      var filtratePrice = function (item) {
        var result = true;

        if (selectCriterion.price !== 'any') {
          switch (selectCriterion.price) {
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
    }
  };

})();
