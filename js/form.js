'use strict';

(function () {
  var DISPLAYED_MESSAGE_TIME = 2000;
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

  var showError = function (element, message) {
    element.style.border = '1px solid #D8000C';
    var box = document.createElement('p');
    box.classList.add('error-message');
    box.textContent = message;
    element.parentElement.appendChild(box);
    element.addEventListener('focus', inputFocusHandler);
    element.addEventListener('blur', inputBlurHandler);
  };
  var InitFormSubmitHandler = function(callback) {
    return function (evt) {
      evt.preventDefault();
      var fields = Array.from(form.elements);

      fields.forEach(function (item) {
        if (item.nodeName.toLowerCase() === 'input') {
          switch (item.type.toLowerCase()) {
            case 'text':
              if (item.name === 'address') {
                if (!item.value.length) {
                  valid = false;
                  showError(item, 'Поле не может быть пустым');
                }
              }
              if (item.name === 'title') {
                if (item.value.length < MIN_LENGTH) {
                  valid = false;
                  showError(item, 'Поле не может содержать менее ' + MIN_LENGTH + ' символов');
                }
                if (item.value.length > MAX_LENGTH) {
                  valid = false;
                  showError(item, 'Поле не может содержать более ' + MAX_LENGTH + ' символов');
                }
              }
              break;
            case 'number':
              if (item.name === 'price') {
                if (item.value < LIMIT_PRICE[form.type.options[form.type.selectedIndex].value]) {
                  valid = false;
                  showError(item, 'Для типа жилья: ' + window.tools.TYPE_PARALLEL[[form.type.options[form.type.selectedIndex].value]] + ' минимальная цена - ' + LIMIT_PRICE[form.type.options[form.type.selectedIndex].value] + ' руб.');
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
          successHandler: function () {
            successMsg.classList.remove('hidden');
            setTimeout(function () {
              successMsg.classList.add('hidden');
            }, DISPLAYED_MESSAGE_TIME);
            window.scrollTo(0, 0);
            callback();
          }
        });
      }
    };
  };

  window.form = {
    initSubmitHandler: InitFormSubmitHandler
  };

})();
