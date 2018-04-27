'use strict';

(function () {
  window.data = {
    TITLES: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],
    MIN_PRICE: 1000,
    MAX_PRICE: 1000000,
    TYPES: ['palace', 'flat', 'house', 'bungalo'],
    MIN_ROOMS: 1,
    MAX_ROOMS: 5,
    MIN_GUESTS: 1,
    MAX_GUESTS: 15,
    TIMES_CHECK: ['12-00', '13-00', '14-00'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    MIN_X: 300,
    MAX_X: 900,
    MIN_Y: 150,
    MAX_Y: 500,
    offerCount: 8,
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    MAIN_PIN_WIDTH: 65,
    MAIN_PIN_HEIGHT: 65,
    MAIN_PIN_TIP: 22,
    pins: document.querySelector('.map__pins'),
    pinTemplate: document.querySelector('template').content.querySelector('.map__pin'),
    cardTemplate: document.querySelector('template').content.querySelector('.popup'),
    mapElements: document.querySelector('.map'),
    activeForm: document.querySelector('.ad-form'),
    fieldsets: document.querySelectorAll('fieldset'),
    mapPinMain: document.querySelector('.map__pin--main'),
    ESC_KEYCODE: 27,
    activePin: null,
    currentOffer: null,
    choiceGuests: {
      'oneGuest': '1',
      'twoGuests': '2',
      'threeGuests': '3',
      'notGuests': '0'
    },
    choiceRooms: {
      'oneRoom': '1',
      'twoRooms': '2',
      'threeRooms': '3',
      'hundredRooms': '100'
    },
    /* минимальное значение цены за ночь */
    appartmentPrice: {
      'bungalo': 0,
      'flat': 1000,
      'house': 5000,
      'palace': 10000
    },
    selectRooms: document.querySelector('.ad-form').querySelector('[name="rooms"]'),
    selectPlace: document.querySelector('.ad-form').querySelector('[name="capacity"]'),
    topLimitY: 150
  };
})();
