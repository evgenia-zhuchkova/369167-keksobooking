'use strict';

(function () {

  
  var MIN_LENGTH = 30;
  var MAX_LENGTH = 100;
  var LIMIT_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var _10n = {
    bungalo: 'Сарай',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };
  var form = document.querySelector('.ad-form');
  var valid = true;
  
  function formSubmitHandler(event) {
    event.preventDefault();
    var fields = Array.from(form.elements);

    fields.forEach(function (elem) {
      if (elem.nodeName.toLowerCase() === 'input') {
        switch (elem.type.toLowerCase()) {
          case 'text':
            if (elem.name === 'address') {
              if (!elem.value.length) {
                valid = false;
                window.error.showFormError(elem, 'Поле не может быть пустым');
              }
            }
            if (elem.name === 'title') {
              if (elem.value.length < MIN_LENGTH || elem.value.length > MAX_LENGTH) {
                valid = false;
                window.error.showFormError(elem);
              }
            }
            break;
          case 'number':
            if (elem.name === 'price') {
              if(elem.value < LIMIT_PRICE[form.type.options[form.type.selectedIndex].value]) {
                valid = false;
                window.error.showFormError(elem, 'Для поля ' + _10n[LIMIT_PRICE[form.type.options[form.type.selectedIndex].value]] + 'мингимальная цена -' + LIMIT_PRICE[form.type.options[form.type.selectedIndex].value]);
              }
            }
            break;
        }
      }
    });
    if (valid) {
      window.tools.ajax({
        method: 'POST',
        url: 'https://js.dump.academy/keksobooking',
        data: new FormData(form)
      });
    }
  }
  form.addEventListener('submit', formSubmitHandler);
  
  
  


})();