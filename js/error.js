'use strict';

(function () {

  var valid = true;

  function inputFocusHandler(event) {
    valid = true;
    if (event.target.style.border) {
      event.target.style.border = '';
      var box = event.target.parentElement.querySelector('.error-message');
      event.target.parentElement.removeChild(box);
    }
  }

  function inputBlurHandler(event) {
    event.target.removeEventListener('focus', inputFocusHandler);
    event.target.removeEventListener('blur', inputBlurHandler);
  }

  window.error = {

    showFormError: function (elem, message) {
      elem.style.border = '1px solid #D8000C';
      var box = document.createElement('p');
      box.style = 'z-index: 500; margin: 0 auto; text-align: center; background-color: #FFBABA; color: #D8000C;';
      box.style.position = 'fixed';
      box.style.left = 0;
      box.style.right = 0;
      box.style.fontSize = '30px';
      box.textContent = message;
      elem.parentElement.appendChild(box);
      elem.addEventListener('focus', inputFocusHandler);
      elem.addEventListener('blur', inputBlurHandler);
    }
  };
})();
