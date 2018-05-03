'use strict';

(function () {
  var offers = null;
  window.data = {
    get: function () {
      return offers;
    },
    set: function (newData) {
      offers = newData;
    }
  };
})();
