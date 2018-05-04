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
  
  function formSubmitHandler(evt) {
    evt.preventDefault();
    var fields = Array.from(form.elements);

    fields.forEach(function (elem) {
      if (elem.nodeName.toLowerCase() === 'input') {
        switch (elem.type.toLowerCase()) {
          case 'text':
            if (elem.name === 'address') {
              if (!elem.value.length) {
                valid = false;
                window.error.show(elem, 'Поле не может быть пустым');
              }
            }
            if (elem.name === 'title') {
              if (!elem.value.length) {
                valid = false;
                window.error.show(elem, 'Поле не может быть пустым');
              }
              if (elem.value.length && elem.value.length < MIN_LENGTH) {
                valid = false;
                window.error.show(elem, 'Поле не может содержать менее ' + MIN_LENGTH + ' символов');
              }
              if (elem.value.length > MAX_LENGTH) {
                valid = false;
                window.error.show(elem, 'Поле не может содержать более ' + MAX_LENGTH + ' символов');
              }
            }
            break;
          case 'number':
            if (elem.name === 'price') {
              if(elem.value < LIMIT_PRICE[form.type.options[form.type.selectedIndex].value]) {
                valid = false;
                window.error.show(elem, 'Для типа жилья: ' + window.tools.TYPE_PARALLEL[[form.type.options[form.type.selectedIndex].value]] + ' минимальная цена - ' + LIMIT_PRICE[form.type.options[form.type.selectedIndex].value] + ' руб.');
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
        success: function() {
          successMsg.classList.remove('hidden');
          window.scrollTo (0, 0);
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }
      });
    }
  }
  form.addEventListener('submit', formSubmitHandler);
  form.addEventListener('reset', function(evt) {
    evt.preventDefault();
    window.scrollTo (0, 0);
    window.location.reload();
  });
})();
