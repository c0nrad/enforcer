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
    State.setState($scope.state);
  };
});

app.service('State', function() {
  var out = {};

  out.getDomain = function(next) {
    chrome.tabs.getSelected(null,function(tab) {
      var matches = tab.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      var domain = matches && matches[1];
      next(domain);
    });
  };

  out.getState = function(next) {
    out.getDomain(function(domain) {
      chrome.extension.sendMessage({greeting: 'getState', domain: domain},
        function (response) {
          var state = response.state;
          state.domain = domain;
          next(state);
        });
    });
  };

  out.setState = function(state) {
    out.getDomain(function(domain) {
      chrome.extension.sendMessage({greeting: 'setState', domain: domain, state: state});
    });
  };

  return out;
});
