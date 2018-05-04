'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;
  var MAX_VIEW_OFFERS = 5;


  var templateTotal = document.querySelector('template');
  var pinTemplate = templateTotal.content.querySelector('.map__pin');
  var cardTemplate = templateTotal.content.querySelector('.map__card');

  var currentPin = null;
  var currentOffer = null;

  var createPin = function (data) {
    var template = pinTemplate.cloneNode(true);
    template.style.left = data.location.x - PIN_WIDTH / 2 + 'px';
    template.style.top = data.location.y + PIN_HEIGHT + 'px';
    template.children[0].src = data.author.avatar;
    template.children[0].alt = data.offer.title;
    return template;
  };

  var createCard = function (data) {
    var newCard = cardTemplate.cloneNode(true);
    newCard.querySelector('.popup__avatar').src = data.author.avatar;
    newCard.querySelector('.popup__title').textContent = data.offer.title;
    newCard.querySelector('.popup__text--address').textContent = data.offer.address;
    newCard.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
    newCard.querySelector('.popup__type').textContent = window.tools.TYPE_PARALLEL[data.offer.type];
    newCard.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнат для ' + data.offer.guests + ' гостей';
    newCard.querySelector('.popup__text--time').textContent = 'заезд после ' + data.offer.checkin + ', ' + 'выезд до ' + data.offer.checkout;
    newCard.querySelector('.popup__features').innerHTML = '';
    data.offer.features.forEach(function (feature) {
      var popupFeature = window.tools.createNewElement('li', 'popup__feature');
      popupFeature.classList.add('popup__feature--' + feature);
      newCard.querySelector('.popup__features').appendChild(popupFeature);
    });
    newCard.querySelector('.popup__description').textContent = data.offer.description;
    newCard.querySelector('.popup__photos').innerHTML = '';
    data.offer.photos.forEach(function (item) {
      var popupPhoto = window.tools.createNewElement('img', 'popup__photo');
      popupPhoto.src = item;
      popupPhoto.width = 45;
      popupPhoto.height = 40;
      newCard.querySelector('.popup__photos').appendChild(popupPhoto);
    });
    return newCard;
  };
  var closePopUpHandler = function () {
    if (currentOffer) {
      currentOffer.remove();
      currentPin.blur();
    }
  };
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      closePopUpHandler();
    }
  });
  window.ad = {
    renderPins: function (data, target) {
      var fragment = document.createDocumentFragment();
      var count = data.length > 5 ? MAX_VIEW_OFFERS : data.length;
      var viewOffers = window.tools.getRandomArr(data, count);
      viewOffers.forEach(function (item) {
        var pin = createPin(item);
        fragment.appendChild(pin);
        pin.addEventListener('click', function (evt) {
          event.preventDefault();
          currentPin = evt.target.closest('.map__pin');
          if (currentOffer) {
            currentOffer.remove();
          }
          currentOffer = createCard(item);
          currentOffer.querySelector('.popup__close').addEventListener('click', closePopUpHandler);
          target.insertAdjacentElement('afterend', currentOffer);
        });
      });
      target.appendChild(fragment);
    }
  };
})();
