'use strict';

(function () {
  window.pin = {
    /* Отрисовывает метку на карте, создает DOM элементы и заполняет их данными из массива */
    createPin: function (data) {
      var template = window.data.pinTemplate.cloneNode(true);
      template.style.left = data.location.x - window.data.PIN_WIDTH / 2 + 'px';
      template.style.top = data.location.y + window.data.PIN_HEIGHT + 'px';
      template.children[0].src = data.author.avatar;
      template.children[0].alt = data.offer.title;
      return template;
    },

    renderPins: function (data) {
      var fragment = document.createDocumentFragment();
      data.forEach(function (item) {
        var pin = window.pin.createPin(item);
        fragment.appendChild(pin);
        pin.addEventListener('click', function (event) {
          event.preventDefault();
          window.data.activePin = event.target.closest('.map__pin');
          if (window.data.currentOffer) {
            window.data.currentOffer.remove();
          }
          window.data.currentOffer = window.card.createCard(item);
          window.data.currentOffer.querySelector('.popup__close').addEventListener('click', window.offer.closePopUpHandler);
          window.data.pins.insertAdjacentElement('afterend', window.data.currentOffer);
        });
      });
      window.data.pins.appendChild(fragment);
    }
  };
})();
