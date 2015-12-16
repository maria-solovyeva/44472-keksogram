'use strict';

(function() {
  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var activeFilter = 'filter-popular';
  var pictures = [];

  var filters = document.querySelectorAll('.filters-radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }

  container.classList.add('pictures-loading');

  getPictures();

  function renderPictures(picturesToRender) {
    container.innerHTML = '';
    var fragment = document.createDocumentFragment();

    picturesToRender.forEach(function(picture) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
  }

  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }
    var filteredPictures = pictures.slice(0);

    switch (id) {
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          var realADate = new Date(a.date);
          var realBDate = new Date(b.date);
          var timestampA = realADate.getTime();
          var timestampB = realBDate.getTime();
          return timestampB - timestampA;
        });
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    renderPictures(filteredPictures);

    activeFilter = id;
  }

  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/pictures.json');
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadedPictures = JSON.parse(rawData);
      updateLoadedPictures(loadedPictures);
    };
    xhr.onerror = function() {
      picturesFailure();
    };
    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      picturesFailure();
    };
    xhr.send();
  }

  function updateLoadedPictures(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter(activeFilter, true);
  }

  function picturesFailure() {
    container.classList.add('pictures-failure');
  }

  function getElementFromTemplate(data) {
    var element;
    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var image = new Image();
    var imageSize = 182;
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
    image.width = imageSize;
    image.height = imageSize;

    return element;
  }
  container.classList.remove('pictures-loading');
})();
