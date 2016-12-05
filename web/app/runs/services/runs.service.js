(function () {
  'use strict';

  angular
    .module('app.runs.services')
    .factory('Runs', Runs);

  Runs.$inject = ['$http', 'apiBaseURL'];

  function Runs($http, apiBaseURL) {
    var Runs = {
      destroy: destroy,
      get: get,
      list: list,
      update: update,
      create: create,
      getStats: getStats
    };
    return Runs;

    /////////////////////

    function destroy(item) {
      return $http.delete(apiBaseURL + '/api/v1/runs/' + item.id + '/');
    }

    function get(id) {
      return $http.get(apiBaseURL + '/api/v1/runs/' + id + '/');
    }

    function list(query) {
      return $http.get(apiBaseURL + '/api/v1/runs/', {
        params: query
      });
    }

    function update(item) {
      return $http.put(apiBaseURL + '/api/v1/runs/' + item.id + '/', {
        entity: item
      });
    }

    function create(item) {
      return $http.post(apiBaseURL + '/api/v1/runs/', {
        entity: item
      });
    }

    function getStats() {
      return $http.get(apiBaseURL + '/api/v1/runs/get/stats/');
    }
  }
})();
