'use strict';

(function () {
  var LOAD_OK = 200;
  var LOAD_BAD_REQUEST = 400;
  var LOAD_NOT_FOUND = 404;
  var LOAD_TIMEOUT = 10000;

  var setup = function (loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case LOAD_OK:
          break;
        case LOAD_BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case LOAD_NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        errorHandler(error);
      }
      if (xhr.response !== null) {
        loadHandler(xhr.response);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });
    xhr.timeout = LOAD_TIMEOUT;
    return xhr;
  };

  window.backend = {
    load: function (loadHandler, errorHandler) {
      var xhr = setup(loadHandler, errorHandler);
      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
      xhr.send();
    },
    save: function (data, saveHandler, errorHandler) {
      var xhr = setup(saveHandler, errorHandler);
      xhr.open('POST', 'https://js.dump.academy/keksobooking');
      xhr.send(data);
    }
  };
}());