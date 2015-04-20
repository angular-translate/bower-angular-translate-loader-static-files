/*!
 * angular-translate - v2.6.1 - 2015-03-01
 * http://github.com/angular-translate/angular-translate
 * Copyright (c) 2015 ; Licensed MIT
 */
angular.module('pascalprecht.translate')
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateStaticFilesLoader
 * @requires $q
 * @requires $http
 *
 * @description
 * Creates a loading function for a typical static file url pattern:
 * "lang-en_US.json", "lang-de_DE.json", etc. Using this builder,
 * the response of these urls must be an object of key-value pairs.
 *
 * Alternatively you can provide a dictionary with the language code as the 
 * key and file path as the value. 
 *
 * @param {object} options Options object, which gets a key and either: 
 * prefix and suffix, or a lookup dictionary with the path to each locale.
 */
.factory('$translateStaticFilesLoader', ['$q', '$http', function ($q, $http) {

  return function (options) {

    if (!options || (!angular.isArray(options.files) && (!angular.isObject(options.lookup) && (!angular.isString(options.prefix) || !angular.isString(options.suffix))))) {
      throw new Error('Couldn\'t load static files, no files and lookup dictionary or prefix or suffix pattern specified!');
    }
    
    if (!options.files) {
      options.files = [{
        prefix: options.prefix,
        suffix: options.suffix
      }];
    }

    var load = function (file) {
      if (!file) {
        throw new Error('Couldn\'t load static file!');
      }
      
      var url;
      
      if(options.lookup) {
        if(!options.lookup[options.key]) {
          throw new Error('Couldn\'t load static file, because ' + options.key + ' is missing in the lookup table!');
        }
        url = options.lookup[options.key];
      } else {
        if (!angular.isString(file.prefix) || !angular.isString(file.suffix)) {
          throw new Error('Couldn\'t load static file, no prefix or suffix specified!');
        }
        url = [
          file.prefix,
          options.key,
          file.suffix
        ].join('');
      }

      var deferred = $q.defer();

      $http(angular.extend({
        url: url,
        method: 'GET',
        params: ''
      }, options.$http)).success(function (data) {
        deferred.resolve(data);
      }).error(function (data) {
        deferred.reject(options.key);
      });

      return deferred.promise;
    };

    var deferred = $q.defer(),
        promises = [],
        length = options.files.length;

    for (var i = 0; i < length; i++) {
      promises.push(load({
        prefix: options.files[i].prefix,
        key: options.key,
        suffix: options.files[i].suffix
      }));
    }

    $q.all(promises).then(function (data) {
      var length = data.length,
          mergedData = {};

      for (var i = 0; i < length; i++) {
        for (var key in data[i]) {
          mergedData[key] = data[i][key];
        }
      }

      deferred.resolve(mergedData);
    }, function (data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };
}]);
