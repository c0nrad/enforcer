'use strict';
var chrome = chrome || {};
var app = angular.module('app', []);

app.controller('MainController', function($scope, State) {

  $scope.state = {};

  State.getState(function(state) {
    $scope.$apply(function() {
        $scope.state = state;
    });
  });

  $scope.saveState = function() {
    console.log('save state mutherfucker');
    State.setState($scope.state);
  };
});

app.service('State', function() {
  var out = {};
  
  out.getState = function(next) {
    chrome.extension.sendMessage({greeting: 'getState'},
      function (response) {
        var state = response.state;
        console.log('jsut recieved state', state);
        next(state);
      });
  };

  out.setState = function(state) {
    console.log('Setting state!', state);
    chrome.extension.sendMessage({greeting: 'setState', state: state});
  };


  return out;
});
