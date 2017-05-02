angular.module('search').factory('SearchService', ['$http', '$q', function ($http, $q) {

    function SearchService() {
        var self = this;
        
        self.search = function (term) {
            return $http.post('/search', {
                term: term
            });
        };
    }

    return new SearchService();

}]);