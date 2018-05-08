'use strict';

(function () {

  var TOP_LIMIT_Y = 150;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_TIP = 22;


  var objectsMerge = function (source, target) {
    var result = {};
    for (var key in target) {
      if (target.hasOwnProperty(key)) {
        if (Object.prototype.toString.call(target[key]) === '[object Object]') {
          result[key] = objectsMerge(source[key], target[key]);
        } else {
          result[key] = key in source ? source[key] : target[key];
        }
      }
    }
    return result;
  };

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
    checkPositionLimits: function (container, position) {
      return ((position.left < 0) || (position.top < TOP_LIMIT_Y) || (position.left + MAIN_PIN_WIDTH > container.width) || (position.top + MAIN_PIN_HEIGHT + MAIN_PIN_TIP > container.height));
    },

    /* Создает DOM - элемент с тегом, именем класса, текстом */
    createNewElement: function (tagName, className, text) {
      var element = document.createElement(tagName);
      element.classList.add(className);
      element.textContent = text || '';
      return element;
    },

    ajax: function (settings) {
      var defSettings = {
        method: 'GET', // метод запроса
        url: '', // адрес запроса
        data: null, // передаваемые данные
        sinc: true, // синхронный или асинхронный запрос
        successHandler: null, // колбэк, выполняется в случае успешно выполненого запроса
        errorHandler: null, // функция обработки ошибок
        type: '', // тип получаемых данных
        readyStateChange: null, // функция обработки ответа сервера
        headers: {} // заголовки для сервера
      };
      // сформируем опции запроса на основе дефолтных настроек и переданных опций
      var options = objectsMerge(settings, defSettings);
      // создадим объект запроса
      var xhr = new XMLHttpRequest();
      xhr.responseType = options.type;
      xhr.open(options.method, options.url, options.sinc);
      // установим заголовок, сообщающий серверу, что это именно AJAX запрос
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      // установим остальные заголовки если есть
      for (var key in options.headers) {
        if (options.headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, options.headers[key]);
        }

      }
      xhr.onreadystatechange = options.readyStateChange || function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          options.successHandler(xhr.response);
        }
        if (xhr.readyState === 4 && xhr.status !== 200) {
          if (typeof options.errorHandler === 'function') {
            options.errorHandler(xhr.response);
          }
        }
      };
      xhr.onerror = function () {
        if (typeof options.errorHandler === 'function') {
          options.errorHandler('Произошла ошибка соединения!');
        }
      };
      xhr.send(options.data);
    },

    getAddress: function (options) {
      return (parseInt(options.left, 10) + parseInt(options.width / 2, 10)) + ', ' + (parseInt(options.top, 10) + parseInt(options.height, 10) + options.delta);
    },

    synchronizeFields: function (eventName, observableElement, callback) {
      callback();
      observableElement.addEventListener(eventName, function () {
        callback();
      });
    },

    checkEntry: function (targetItems, values) {
      for (var i = 0; i < values.length; i++) {
        if (targetItems.indexOf(values[i]) === -1) {
          return false;
        }
      }
      return true;
    },

    TYPE_PARALLEL: {
      bungalo: 'cарай',
      flat: 'квартира',
      house: 'дом',
      palace: 'дворец'
    }
  };
})();
