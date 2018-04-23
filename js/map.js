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
var PIN_ARROW_HEIGHT = 22;
var pins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('template').content.querySelector('.popup');
var newCard = cardTemplate.cloneNode(true);
var mapElements = document.querySelector('.map');
var activeForm = document.querySelector('.ad-form');
var fieldsets = document.querySelectorAll('fieldset');
var mapPinMain = document.querySelector('.map__pin--main');
var address = document.querySelector('#address');
var mapPinMainWidth = mapPinMain.querySelector('img').width;
var mapPinMainHeight = mapPinMain.querySelector('img').height;
var mapPinMainCenterX = parseInt(mapPinMain.style.left, 10);
var mapPinMainCenterY = parseInt(mapPinMain.style.top, 10);
var ESC_KEYCODE = 27;
var activePin = null;
var currentOffer = null;
var choiceGuests = {
  'oneGuest': '1',
  'twoGuests': '2',
  'threeGuests': '3',
  'notGuests': '0'
};
var choiceRooms = {
  'oneRoom': '1',
  'twoRooms': '2',
  'threeRooms': '3',
  'hundredRooms': '100'
};
/* минимальное значение цены за ночь */
var appartmentPrice = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};
var selectRooms = activeForm.querySelector('[name="rooms"]');
var selectPlace = activeForm.querySelector('[name="capacity"]');

/* Блокировка полей */
var disableFieldsets = function (flag) {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = flag;
  }
};

/* Определяет начальный адрес */
var setAddress = function () {
  address.value = (mapPinMainCenterX - mapPinMainWidth / 2) + ', ' + (mapPinMainCenterY - mapPinMainHeight / 2);
  address.readOnly = true;
};

/* Обновление координат адреса */
var reNewAddress = function () {
  address.value = (mapPinMainCenterX + mapPinMainWidth / 2) + ', ' + (mapPinMainCenterY + mapPinMainHeight / 2 + PIN_ARROW_HEIGHT);
};

/* Активация страницы */
var activatePage = function (activePosition) {
  if (activePosition) {
    mapElements.classList.remove('map--faded');
    activeForm.classList.remove('ad-form--disabled');
  } else {
    mapElements.classList.add('map--faded');
    activeForm.classList.add('ad-form--disabled');
  }
  setAddress();
  disableFieldsets(!activePosition);
};

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

var renderPins = function (data) {
  var fragment = document.createDocumentFragment();
  data.forEach(function (item) {
    var pin = createPin(item);
    fragment.appendChild(pin);
    pin.addEventListener('click', function (event) {
      event.preventDefault();
      activePin = event.target.closest('.map__pin');
      if (currentOffer) {
        currentOffer.remove();
      }
      currentOffer = createCard(item);
      currentOffer.querySelector('.popup__close').addEventListener('click', closePopUpHandler);
      pins.insertAdjacentElement('afterend', currentOffer);
    });
  });
  pins.appendChild(fragment);
};

/* Создает DOM - элемент с тегом, именем класса, текстом */
var createNewElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  element.textContent = text || '';
  return element;
};

/* Создает DOM - элемент обьявления с данными */

var createCard = function (data) {
  newCard.querySelector('.popup__avatar').src = data.author.avatar;
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
  data.offer.photos.forEach(function (item) {
    var popupPhoto = createNewElement('img', 'popup__photo');
    popupPhoto.src = item;
    popupPhoto.width = 45;
    popupPhoto.height = 40;
    newCard.querySelector('.popup__photos').appendChild(popupPhoto);
  });
  return newCard;
};

/* Переводит страницу в активное состояние и устанавливает значения поля ввода адреса */
var activePageHandler = function () {
  activatePage(true);
  renderPins(renderOffers(offerCount));
  reNewAddress();
  mapPinMain.removeEventListener('mouseup', activePageHandler);
};

mapPinMain.addEventListener('mouseup', activePageHandler);

var closePopUpHandler = function (evt) {
  evt.preventDefault();
  closeOffer();
};

var closeOffer = function () {
  if (currentOffer) {
    currentOffer.remove();
    activePin.blur();
    currentOffer.querySelector('.popup__close').removeEventListener('click', closePopUpHandler);
  }
};

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.preventDefault();
    closeOffer();
  }
});

/* Минимальная цена за ночь в зависимости от типа жилья */
var typeChangeHandler = function () {
  var selectType = activeForm.querySelector('[name="type"]');
  var labelType = activeForm.querySelector('[name="price"]');
  selectType.addEventListener('change', function () {
    labelType.placeholder = appartmentPrice[selectType.value];
    labelType.min = appartmentPrice[selectType.value];
  });
};

/* Минимальное число гостей в зависимости от количества комнат */
var setupRoomsOfGuests = function (rooms, capacity) {
  if (rooms === choiceRooms.oneRoom && capacity !== choiceGuests.oneGuest) {
    selectPlace.setCustomValidity('1 комната — «для 1 гостя»');
  } else if (rooms === choiceRooms.twoRooms && capacity !== choiceGuests.oneGuest && capacity !== choiceGuests.twoGuests) {
    selectPlace.setCustomValidity('2 комнаты — «для 2 гостей» или «для 1 гостя»');
  } else if (rooms === choiceRooms.threeRooms && capacity === choiceGuests.notGuests) {
    selectPlace.setCustomValidity('3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»');
  } else if (rooms === choiceRooms.hundredRooms && capacity !== choiceGuests.notGuests) {
    selectPlace.setCustomValidity('«не для гостей»');
  } else {
    selectPlace.setCustomValidity('');
  }
};

/* Синхронизация времени заезда и времени выезда */
var setupTimeAccommodation = function () {
  var selectTimeIn = activeForm.querySelector('[name="timein"]');
  var selectTimeOut = activeForm.querySelector('[name="timeout"]');
  if (selectTimeIn.value !== selectTimeOut.value) {
    selectTimeIn.setCustomValidity('Время заезда  и время выезда должно совпадать');
  } else {
    selectTimeIn.setCustomValidity('');
  }
};

var formButtonClickHandler = function () {
  setupRoomsOfGuests(selectRooms.value, selectPlace.value);
  setupTimeAccommodation();
};

/* Подтверждение правильности заполнения формы */
var confirmForm = function () {
  var selectType = activeForm.querySelector('[name="type"]');
  var submitFormButton = activeForm.querySelector('[type="submit"]');
  selectType.addEventListener('focus', typeChangeHandler);
  selectType.addEventListener('blur', function () {
    selectType.removeEventListener('focus', typeChangeHandler);
  });
  submitFormButton.addEventListener('click', formButtonClickHandler);
};

confirmForm();
