/*
Instructions:
(1) Use Promise.all to refactor the .map code by passing Promise.all an array of Promises.
  (a) Each Promise will be executed in parallel.
  (b) The return values will be returned in the same order as the Promises were created.
Hint: you'll probably still need to use .map.
 */

(function(document) {
  'use strict';

  var home = null;

  /**
   * Helper function to show the search query.
   * @param {String} query - The search query.
   */
  function addSearchHeader(query) {
    home.innerHTML = '<h2 class="page-title">query: ' + query + '</h2>';
  };

  /**
   * Helper function to create a planet thumbnail.
   * @param  {Object} data - The raw data describing the planet.
   */
  function createPlanetThumb(data) {
    var pT = document.createElement('planet-thumb');
    for (let d in data) {
      pT[d] = data[d];
    }
    home.appendChild(pT);
  };

  /**
   * XHR wrapped in a promise
   * @param  {String} url - The URL to fetch.
   * @return {Promise}    - A Promise that resolves when the XHR succeeds and fails otherwise.
   */
  function get(url) {
    return fetch(url);
  };

  /**
   * Performs an XHR for a JSON and returns a parsed JSON response.
   * @param  {String} url - The JSON URL to fetch.
   * @return {Promise}    - A promise that passes the parsed JSON response.
   */
  function getJSON(url) {
    return get(url).then(function(response) {
      return response.json();
    });
  };

  window.addEventListener('WebComponentsReady', function() {
    home = document.querySelector('section[data-route="home"]');

    getJSON('../data/earth-like-results.json')
    .then(function(response) {
      return Promise.all(response.results.map(getJSON));
    })
    .then(function(planetData) {
      planetData.forEach(function(planet) {
        createPlanetThumb(planet);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  });
})(document);