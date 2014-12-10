/*!
 * angular-translate - v2.5.0 - 2014-12-07
 * http://github.com/angular-translate/angular-translate
 * Copyright (c) 2014 ; Licensed MIT
 */
angular.module('pascalprecht.translate').factory('$translateStaticFilesLoader', [
  '$q',
  '$http',
  function ($q, $http) {
    return function (options) {
      if (!options || (!angular.isArray(options.files) && (!angular.isString(options.prefix) || !angular.isString(options.suffix)))) {
        throw new Error('Couldn\'t load static files: no files or prefix and suffix specified!');
      }
      
      if (!options.files) {
        options.files = [{
          prefix: options.prefix,
          suffix: options.suffix
        }];
      }
      
      var load = function (file) {
        if (!file || (!angular.isString(file.prefix) || !angular.isString(file.suffix))) {
          throw new Error('Couldn\'t load static file: no prefix or suffix specified!');
        }
        
        var deferred = $q.defer();
        
        $http(angular.extend({
          url: [
            file.prefix,
            file.key,
            file.suffix
          ].join(''),
          method: 'GET',
          params: ''
        }, file.$http)).success(function (data) {
          deferred.resolve(data);
        }).error(function (data) {
          deferred.reject(file.key);
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
          angular.forEach(data[i], function(value, key) {
            mergedData[key] = value;
          });
        }
        
        deferred.resolve(mergedData);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    };
  }
]);
