'use strict';

(function () {
  /* Минимальная цена за ночь в зависимости от типа жилья */
  var typeChangeHandler = function () {
    var selectType = window.data.activeForm.querySelector('[name="type"]');
    var labelType = window.data.activeForm.querySelector('[name="price"]');
    selectType.addEventListener('change', function () {
      labelType.placeholder = window.data.appartmentPrice[selectType.value];
      labelType.min = window.data.appartmentPrice[selectType.value];
    });
  };

  /* Минимальное число гостей в зависимости от количества комнат */
  var setupRoomsOfGuests = function (rooms, capacity) {
    if (rooms === window.data.choiceRooms.oneRoom && capacity !== window.data.choiceGuests.oneGuest) {
      window.data.selectPlace.setCustomValidity('1 комната — «для 1 гостя»');
    } else if (rooms === window.data.choiceRooms.twoRooms && capacity !== window.data.choiceGuests.oneGuest && capacity !== window.data.choiceGuests.twoGuests) {
      window.data.selectPlace.setCustomValidity('2 комнаты — «для 2 гостей» или «для 1 гостя»');
    } else if (rooms === window.data.choiceRooms.threeRooms && capacity === window.data.choiceGuests.notGuests) {
      window.data.selectPlace.setCustomValidity('3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»');
    } else if (rooms === window.data.choiceRooms.hundredRooms && capacity !== window.data.choiceGuests.notGuests) {
      window.data.selectPlace.setCustomValidity('«не для гостей»');
    } else {
      window.data.selectPlace.setCustomValidity('');
    }
  };

  /* Синхронизация времени заезда и времени выезда */
  var setupTimeAccommodation = function () {
    var selectTimeIn = window.data.activeForm.querySelector('[name="timein"]');
    var selectTimeOut = window.data.activeForm.querySelector('[name="timeout"]');
    if (selectTimeIn.value !== selectTimeOut.value) {
      selectTimeIn.setCustomValidity('Время заезда  и время выезда должно совпадать');
    } else {
      selectTimeIn.setCustomValidity('');
    }
  };

  var formButtonClickHandler = function () {
    setupRoomsOfGuests(window.data.selectRooms.value, window.data.selectPlace.value);
    setupTimeAccommodation();
  };

  /* Подтверждение правильности заполнения формы */
  var confirmForm = function () {
    var selectType = window.data.activeForm.querySelector('[name="type"]');
    var submitFormButton = window.data.activeForm.querySelector('[type="submit"]');
    selectType.addEventListener('focus', typeChangeHandler);
    submitFormButton.addEventListener('click', formButtonClickHandler);
  };

  confirmForm();
})();
