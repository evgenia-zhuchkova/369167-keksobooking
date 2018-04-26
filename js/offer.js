'use strict';

(function () {
  window.offer = {
    /* Массив с  данными */
    createOffer: function (index) {
      var x = window.tools.getRandomInteger(window.data.MIN_X, window.data.MAX_X);
      var y = window.tools.getRandomInteger(window.data.MIN_Y, window.data.MAX_Y);
      var time = window.tools.getShuffle(window.data.TIMES_CHECK, 0);
      var data = {
        author: {
          avatar: 'img/avatars/user0' + (index + 1) + '.png'
        },
        offer: {
          title: window.data.TITLES[index],
          address: x + ', ' + y,
          price: window.tools.getRandomInteger(window.data.MIN_PRICE, window.data.MAX_PRICE),
          type: window.tools.getShuffle(window.data.TYPES, 0),
          rooms: window.tools.getRandomInteger(window.data.MIN_ROOMS, window.data.MAX_ROOMS),
          guests: window.tools.getRandomInteger(window.data.MIN_GUESTS, window.data.MAX_GUESTS),
          checkin: time,
          checkout: time,
          features: window.tools.getRandomArr(window.data.FEATURES, window.tools.getRandomInteger(1, window.data.FEATURES.length)),
          description: '',
          photos: window.tools.getRandomArr(window.data.PHOTOS, window.data.PHOTOS.length)
        },
        location: {
          x: x,
          y: y
        }
      };
      return data;
    },

    /* Создание обьявлений */
    renderOffers: function (offers) {
      var offerings = [];
      for (var i = 0; i < offers; i++) {
        offerings[i] = window.offer.createOffer(i);
      }
      return offerings;
    },

    closePopUpHandler: function (evt) {
      evt.preventDefault();
      window.offer.closeOffer();
    },

    closeOffer: function () {
      if (window.data.currentOffer) {
        window.data.currentOffer.remove();
        window.data.activePin.blur();
        window.data.currentOffer.querySelector('.popup__close').removeEventListener('click', window.offer.closePopUpHandler);
      }
    }

  };
})();
