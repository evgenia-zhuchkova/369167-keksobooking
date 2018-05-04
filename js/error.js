'use strict';

(function () {

  var valid = true;

  var inputFocusHandler = function (evt) {
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

  window.error = {

    show: function (elem, message) {
      elem.style.border = '1px solid #D8000C';
      var box = document.createElement('p');
      box.classList.add('error-message');
      box.textContent = message;
      elem.parentElement.appendChild(box);
      elem.addEventListener('focus', inputFocusHandler);
      elem.addEventListener('blur', inputBlurHandler);
    }
  };
})();
