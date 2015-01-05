'use strict';

var chrome = chrome || {};
var app = angular.module('app', []);


app.controller('MainController', function($scope, $rootScope, State) {
  $scope.state = {};
  $scope.directives = ['default-src', 'script-src', 'object-src', 'img-src', 'media-src', 'child-src', 'frame-ancestors', 'font-src', 'form-action', 'connect-src', 'style-src', 'report-uri'];
  $scope.policy = new Policy();

  $rootScope.$on('state', function(event, state) {
    $scope.$apply(function() {
      $scope.state = state;
      $scope.policy = new Policy(state.policy);
    });
  });

  $scope.updateDirective = function(directive, value) {
    $scope.policy.set(directive, value);
  };

  // the policy.raw changes, update the child directives
  $scope.updateDirectives = function() {
    $scope.policy = new Policy($scope.policy.raw);
    $scope.saveState();
  };

  // the polocy.directives changed, update the raw
  $scope.updatePolicy = function() {
    $scope.policy.raw = $scope.policy.string();
    $scope.saveState();
  };

  $scope.saveState = function() {
    $scope.state.policy = $scope.policy.toString();
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
