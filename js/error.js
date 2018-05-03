'use strict';

(function () {

  

  var generateStyle = function () {
    var style = document.createElement('style');

    style.type = 'text/css';
    style.textContent = [
      '.error {z-index:500; background-color: #FFBABA;; color: #D8000C; border: 1px solid #D8000C;}'
    ].join('\n');

    document.head.appendChild(style);
  };

  generateStyle();
})();