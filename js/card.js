'use strict';

(function () {
  window.card = {
    /* Создает DOM - элемент обьявления с данными */
    createCard: function (data) {
      var newCard = window.data.cardTemplate.cloneNode(true);
      newCard.querySelector('.popup__avatar').src = data.author.avatar;
      newCard.querySelector('.popup__title').textContent = data.offer.title;
      newCard.querySelector('.popup__text--address').textContent = data.offer.address;
      newCard.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
      newCard.querySelector('.popup__type').textContent = data.offer.type;
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
    }
  };
})();
