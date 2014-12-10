# bower-angular-translate-loader-static-files

angular-translate-loader-static-files bower package

### Installation

````
$ bower install angular-translate-loader-static-files
````
=======

### Usage

There are two ways to use this loader.

##### Object

    $translateProvider
      .useStaticFilesLoader({
        prefix: '/path/to/locales/',
        suffix: '.json'
      });

##### Array

*Since files are requested asynchronously, duplicate keys will be overwritten in an unpredictable manner.*

    $translateProvider
      .useStaticFilesLoader({
        files: [{
          prefix: '/path/to/locales/',
          suffix: '.json'
        }, {
          prefix: 'relative/path/to/locales/',
          suffix: ''
        }, {
          prefix: '/another/path/to/locales/',
          suffix: '.json'
        }]
      });