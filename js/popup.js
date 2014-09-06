'use strict';

var chrome = chrome || {};
var app = angular.module('app', []);

app.controller('MainController', function($scope, $rootScope, State) {
  $scope.state = {};

  $rootScope.$on('state', function(event, state) {
    $scope.$apply(function() {
      $scope.state = state;
    });
  });

  $scope.saveState = function() {
    State.setState($scope.state);
  };

  $scope.getState = function() {
    State.getState();
  };

  $scope.generateEndpoint = function() {
    State.getEndpoint();
  };

  State.getState();
});

app.service('State', function($rootScope) {
  var out = { state: {}, domain: ''};
  var port = chrome.extension.connect({name: 'enforcer'});

  port.onMessage.addListener(function(response) {
    response.state.domain = out.domain;
    $rootScope.$emit('state', response.state);
  });

  out.getDomain = function(next) {
    chrome.tabs.getSelected(null,function(tab) {
      var matches = tab.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      var domain = matches && matches[1];
      out.domain = domain;
      next(domain);
    });
  };

  out.getState = function() {
    out.getDomain(function(domain) {
      port.postMessage({greeting:'getState', domain: domain});
    });
  };

  out.getEndpoint = function() {
    out.getDomain(function(domain) {
      port.postMessage({greeting:'getEndpoint', domain: domain});
    });
  };

  out.setState = function(state) {
    out.getDomain(function(domain) {
      port.postMessage({greeting:'setState', domain: domain, state: state});
    });
  };

  return out;
});
