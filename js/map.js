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
var PIN_WIDTH = 60;
var PIN_HEIGHT = 80;
var pins = document.querySelector('.map__pins');
var pinTemplate = document.getElementsByTagName('template')[0].content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var mapFiltersContainer = document.querySelector('.map__filters-container');

/* Убирает класс map--faded */
var mapElements = document.querySelector('.map');
mapElements.classList.remove('map--faded');

/* Случайное целое число в интервале от min до max, включая min и max */
var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

/* Перемешивает массив */
var getShuffle = function (arr, startIndex) {
  for (var i = 0; i < startIndex; i++) {
    var currentIndex = getRandomInteger(0, i);
    var interimIndex = arr[currentIndex];
    arr[currentIndex] = arr[i];
    arr[i] = interimIndex;
  }
  return interimIndex;
};

/* Массив с  данными */
var createOffer = function (index) {
  var x = getRandomInteger(MIN_X, MAX_X);
  var y = getRandomInteger(MIN_Y, MAX_Y);
  var time = getShuffle(TIMES_CHECK, TIMES_CHECK.length);
  var data = {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: TITLES[index],
      address: x + ', ' + y,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: getShuffle(TYPES, TYPES.length),
      rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
      checkin: time,
      checkout: time,
      features: FEATURES.slice(getRandomInteger(0, FEATURES.length - 1)),
      description: '',
      photos: PHOTOS.sort()
    },
    location: {
      x: x,
      y: y
    }
  };
  return data;
};

var offerings = [];
for (var i = 0; i < offerCount; i++) {
  offerings[i] = createOffer(i);
}

/* Отрисовывает метку на карте, создает DOM элементы и заполняет их данными из массива */

var createPin = function (data) {
  var template = pinTemplate.cloneNode(true);
  template.style.left = (data.location.x + PIN_WIDTH) / 2 + 'px';
  template.style.left = data.location.y + PIN_HEIGHT + 'px';
  template.children[0].src = data.author.avatar;
  template.children[0].alt = data.offer.title;
  return template;
};

for (var j = 0; j < offerings.length; j++) {
  fragment.appendChild(createPin(offerings[j]));
}

pins.appendChild(fragment);

/* Создает DOM - элемент с тегом, именем класса, текстом */
var createNewElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

/* Создает DOM - элемент обьявления с данными */

var createCard = function (data) {
  var cardTemplate = document.getElementsByTagName('template')[0].content.querySelector('.popup');
  var newCard = cardTemplate.cloneNode(true);
  var cardTitle = newCard.querySelector('.popup__title');
  var cardAddress = newCard.querySelector('.popup__text--address');
  var cardPrice = newCard.querySelector('.popup__text--price');
  var cardType = newCard.querySelector('.popup__type');
  var cardCapacity = newCard.querySelector('.popup__text--capacity');
  var cardTime = newCard.querySelector('.popup__text--time');
  var cardFeatures = newCard.querySelector('.popup__features');
  var cardDescription = newCard.querySelector('.popup__description');
  var cardPhotos = newCard.querySelector('.popup__photos');
  cardTitle.textContent = data.offer.title;
  cardAddress.textContent = data.offer.address;
  cardPrice.textContent = data.offer.price + '₽/ночь';
  cardType.textContent = data.offer.type;
  cardCapacity.textContent = data.offer.rooms + ' комнат для ' + data.offer.guests + ' гостей';
  cardTime.textContent = 'заезд после ' + data.offer.checkin + ', ' + 'выезд до ' + data.offer.checkout;
  cardFeatures.innerHTML = '';
  data.offer.features.forEach(function (feature) {
    var popupFeature = createNewElement('li', 'popup__feature');
    popupFeature.classList.add('popup__feature--' + feature);
    cardFeatures.appendChild(popupFeature);
  });
  cardDescription.textContent = data.offer.description;
  var drawPhotos = function (photo) {
    var popupPhoto = createNewElement('img', 'popup__photo');
    popupPhoto.src = photo;
    popupPhoto.width = 50;
    popupPhoto.height = 45;
    cardPhotos.appendChild(popupPhoto);
  };
  cardPhotos.innerHTML = '';
  data.offer.photos.forEach(drawPhotos);

  return newCard;
};
mapElements.insertBefore(createCard(offerings[0]), mapFiltersContainer);
