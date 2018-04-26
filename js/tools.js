'use strict';

(function () {
  window.tools = {
    /* Случайное целое число в интервале от min до max, включая min и max */
    getRandomInteger: function (min, max) {
      var rand = min - 0.5 + Math.random() * (max - min + 1);
      rand = Math.round(rand);
      return rand;
    },

    /* Получает случайный элемент массива */
    getShuffle: function (elements, startIndex) {
      var index = window.tools.getRandomInteger(startIndex, elements.length - 1);
      var interimIndex = elements[index];
      elements[index] = elements[startIndex];
      elements[startIndex] = interimIndex;
      return interimIndex;
    },

    /* Получает случайный массив */
    getRandomArr: function (endItems, count) {
      var resultElements = [];
      for (var k = 0; k < count; k++) {
        resultElements.push(window.tools.getShuffle(endItems, k));
      }
      return resultElements;
    },

    /* Ограничение по перемещению метки */
    limitsPosition: function (container, position) {
      return ((position.left < 0) || (position.top < window.data.topLimitY) || (position.left + window.data.MAIN_PIN_WIDTH > container.width) || (position.top + window.data.MAIN_PIN_HEIGHT + window.data.MAIN_PIN_TIP > container.height));
    },

    /* Создает DOM - элемент с тегом, именем класса, текстом */
    createNewElement: function (tagName, className, text) {
      var element = document.createElement(tagName);
      element.classList.add(className);
      element.textContent = text || '';
      return element;
    }

  };
})();
