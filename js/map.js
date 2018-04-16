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
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 150;
var MAX_Y = 500;
var offerCount = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var pins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var mapFiltersContainer = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template').content.querySelector('.popup');

/* Убирает класс map--faded */
var mapElements = document.querySelector('.map');
mapElements.classList.remove('map--faded');

/* Случайное целое число в интервале от min до max, включая min и max */
var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

/* Получает случайный элемент массива */
var getShuffle = function (elements, startIndex) {
  var index = getRandomInteger(startIndex, elements.length - 1);
  var interimIndex = elements[index];
  elements[index] = elements[startIndex];
  elements[startIndex] = interimIndex;
  return interimIndex;
};

/* Получает случайный массив */
var getRandomArr = function (endItems, count) {
  var resultElements = [];
  for (var k = 0; k < count; k++) {
    resultElements.push(getShuffle(endItems, k));
  }
  return resultElements;
};

/* Массив с  данными */
var createOffer = function (index) {
  var x = getRandomInteger(MIN_X, MAX_X);
  var y = getRandomInteger(MIN_Y, MAX_Y);
  var time = getShuffle(TIMES_CHECK, 0);
  var data = {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: TITLES[index],
      address: x + ', ' + y,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: getShuffle(TYPES, 0),
      rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
      checkin: time,
      checkout: time,
      features: getRandomArr(FEATURES, getRandomInteger(1, FEATURES.length)),
      description: '',
      photos: getRandomArr(PHOTOS, PHOTOS.length)
    },
    location: {
      x: x,
      y: y
    }
  };
  return data;
};

var renderOffers = function (offers) {
  var offerings = [];
  for (var i = 0; i < offers; i++) {
    offerings[i] = createOffer(i);
  }
  return offerings;
};

/* Отрисовывает метку на карте, создает DOM элементы и заполняет их данными из массива */

var createPin = function (data) {
  var template = pinTemplate.cloneNode(true);
  template.style.left = data.location.x - PIN_WIDTH / 2 + 'px';
  template.style.top = data.location.y + PIN_HEIGHT + 'px';
  template.children[0].src = data.author.avatar;
  template.children[0].alt = data.offer.title;
  return template;
};

var renderPins = function (parametrs) {
  var lengthArr = parametrs.length;
  for (var j = 0; j < lengthArr; j++) {
    fragment.appendChild(createPin(parametrs[j]));
  }
  pins.appendChild(fragment);
};

renderPins(renderOffers(offerCount));

/* Создает DOM - элемент с тегом, именем класса, текстом */
var createNewElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  element.textContent = text || '';
  return element;
};

/* Создает DOM - элемент обьявления с данными */

var createCard = function (data) {
  var newCard = cardTemplate.cloneNode(true);
  newCard.querySelector('.popup__title').textContent = data.offer.title;
  newCard.querySelector('.popup__text--address').textContent = data.offer.address;
  newCard.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
  newCard.querySelector('.popup__type').textContent = data.offer.type;
  newCard.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнат для ' + data.offer.guests + ' гостей';
  newCard.querySelector('.popup__text--time').textContent = 'заезд после ' + data.offer.checkin + ', ' + 'выезд до ' + data.offer.checkout;
  newCard.querySelector('.popup__features').innerHTML = '';
  data.offer.features.forEach(function (feature) {
    var popupFeature = createNewElement('li', 'popup__feature');
    popupFeature.classList.add('popup__feature--' + feature);
    newCard.querySelector('.popup__features').appendChild(popupFeature);
  });
  newCard.querySelector('.popup__description').textContent = data.offer.description;
  newCard.querySelector('.popup__photos').innerHTML = '';
  data.offer.photos.forEach(function(item) {
    var popupPhoto = createNewElement('img', 'popup__photo');
    popupPhoto.src = item;
    popupPhoto.width = 45;
    popupPhoto.height = 40;
    newCard.querySelector('.popup__photos').appendChild(popupPhoto);
  });
  return newCard;
};
mapElements.insertBefore(createCard(renderOffers(offerCount)[0]), mapFiltersContainer);
