'use strict';

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 15;
var TIMES_CHECK = ['12-00', '13-00', '14-00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg' ];
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 150;
var MAX_Y = 500;

/* Убирает класс map--faded */
var mapUse = document.querySelector('.map');
mapUse.classList.remove('map--faded');

/* Случайное целое число в интервале от min до max, включая min и max */
var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

/* Перемешивает массив */
var getShuffle = function() {
    for (var i = this.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = this[num];
        this[num] = this[i];
        this[i] = d;
    }
    return this;
};

/* Случайная опция */
var getFeatures = function() {
  var randomNumber = getRandomInteger(1, FEATURES.length);
  return getShuffle(FEATURES).slice(0, randomNumber);
};


var setLabel = function () {
  var offering = [];
  for (var i = 0; i < TITLES.length; i++) {
    var x = getRandomInteger(MIN_X, MAX_X);
    var y = getRandomInteger(MIN_Y, MAX_Y);
    var obj = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLES[i],
        address: x + ', ' + y,
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
        type:  getShuffle(TYPES),
        rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
        checkin: getShuffle(TIMES_CHECK),
        checkout: getShuffle(TIMES_CHECK),
        features: getFeatures(FEATURES),
        description: '',
        photos: getShuffle(PHOTOS)
      },
      location: {
        x: x,
        y: y
      }
    };
offering.push(obj);
  }
  return offering;
};

var offering = setLabel();

/* Создание случайной метки на карте */

var createPins = function(offerList) {
  var pins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('.map__pin');
  var pinFragment = document.createDocumentFragment();
  for (var i = 0; i < offerList.length; i++) {
    var template = pinTemplate.cloneNode(true);
    template.style = 'left: ' + offerList[i].location.x  + 'px; top: ' + offerList[i].location.y + 'px';
    template.querySelector('img').src = offerList[i].author.avatar;
    pinFragment.appendChild(template);
  }
  pins.appendChild(pinFragment);
};

createPins(offering);


/* Вывод на карте */
function createMapCard(offerList) {
  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCardTemplate = document.querySelector('#card-template').content.querySelector('.map__card');

  for (var i = 0; i < offerList.length; i++) {
    var CardElement = mapCardTemplate.cloneNode(true);
    CardElement.querySelector('.popup__avatar').src = offerList[i].author.avatar;
    CardElement.querySelector('.popup__title').textContent = offerList[i].offer.title;
    CardElement.querySelector('.popup__text--address').textContent = offerList[i].offer.address;
    CardElement.querySelector('.popup__text--price').textContent = offerList[i].offer.price + ' Р/ночь';
    CardElement.querySelector('.popup__type').textContent = offerList[i].offer.type;
    CardElement.querySelector('.popup__text--capacity').textContent = offerList[i].offer.rooms + ' комната для ' + offerList[i].offer.guests + ' гостей';
    CardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerList[i].offer.checkin + ' ,' + ' выезд до ' + offerList[i].offer.checkout;
    CardElement.querySelector('.popup__description').textContent = offerList[i].offer.description;  
  }
}
createMapCard(offering);
