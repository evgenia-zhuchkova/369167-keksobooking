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

  var form = document.querySelector('.ad-form');
  var successMsg = document.querySelector('.success');
  var valid = true;

  var inputFocusHandler = function (evt) {
    valid = true;
    if (evt.target.style.border) {
      evt.target.style.border = '';
      var box = evt.target.parentElement.querySelector('.error-message');
      evt.target.parentElement.removeChild(box);
    }
  };

  var inputBlurHandler = function (evt) {
    evt.target.removeEventListener('focus', inputFocusHandler);
    evt.target.removeEventListener('blur', inputBlurHandler);
  };

  var showError = function (elem, message) {
    elem.style.border = '1px solid #D8000C';
    var box = document.createElement('p');
    box.classList.add('error-message');
    box.textContent = message;
    elem.parentElement.appendChild(box);
    elem.addEventListener('focus', inputFocusHandler);
    elem.addEventListener('blur', inputBlurHandler);
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    var fields = Array.from(form.elements);

    fields.forEach(function (elem) {
      if (elem.nodeName.toLowerCase() === 'input') {
        switch (elem.type.toLowerCase()) {
          case 'text':
            if (elem.name === 'address') {
              if (!elem.value.length) {
                valid = false;
                showError(elem, 'Поле не может быть пустым');
              }
            }
            if (elem.name === 'title') {
              if (elem.value.length < MIN_LENGTH) {
                valid = false;
                showError(elem, 'Поле не может содержать менее ' + MIN_LENGTH + ' символов');
              }
              if (elem.value.length > MAX_LENGTH) {
                valid = false;
                showError(elem, 'Поле не может содержать более ' + MAX_LENGTH + ' символов');
              }
            }
            break;
          case 'number':
            if (elem.name === 'price') {
              if (elem.value < LIMIT_PRICE[form.type.options[form.type.selectedIndex].value]) {
                valid = false;
                showError(elem, 'Для типа жилья: ' + window.tools.TYPE_PARALLEL[[form.type.options[form.type.selectedIndex].value]] + ' минимальная цена - ' + LIMIT_PRICE[form.type.options[form.type.selectedIndex].value] + ' руб.');
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
        data: new FormData(form),
        success: function () {
          successMsg.classList.remove('hidden');
          window.scrollTo(0, 0);
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }
      });
    }
  };
  form.addEventListener('submit', formSubmitHandler);
  form.addEventListener('reset', function (evt) {
    evt.preventDefault();
    window.scrollTo(0, 0);
    window.location.reload();
  });
})();
