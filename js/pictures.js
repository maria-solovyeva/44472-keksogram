'use strict';

(function() {
  var filters = document.querySelector('.filters');
  var container = document.querySelector('.pictures');

  filters.classList.add('hidden');

  window.pictures.forEach(function(picture) {
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var element;
    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var image = new Image(182, 182);

    var IMAGE_TIMEOUT = 10000;

    var imageLoadTimeout = setTimeout(function() {
      image.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);

    image.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(image, element.querySelector('img'));
    };

    image.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    image.src = data.url;

    return element;
  }
  filters.classList.remove('hidden');
})();
