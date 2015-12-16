'use strict';

(function() {
  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var activeFilter = 'filter-popular';
  var pictures = [];
  var filteredPictures = [];

  var currentPage = 0;
  var PAGE_SIZE = 12;

  var filters = document.querySelector('.filters');
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  container.classList.add('pictures-loading');

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(addPageToScroll, 100);
  });

  function addPageToScroll() {
    var footerCoordinates = document.querySelector('.pictures').getBoundingClientRect();
    var viewportSize = window.innerHeight;
    if (footerCoordinates.bottom - viewportSize <= footerCoordinates.height) {
      if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
        renderPictures(filteredPictures, ++currentPage);
      }
    }
  }

  getPictures();

  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      container.innerHTML = '';
    }
    var fragment = document.createDocumentFragment();

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(from, to);
    pagePictures.forEach(function(picture) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
  }

  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }
    filteredPictures = pictures.slice(0);

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

    renderPictures(filteredPictures, 0, true);

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
