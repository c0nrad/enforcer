'use strict';

var chrome = chrome || {};
var $ = $ || {};
var states = {};

function defaultState() {
  var state = {};
  state.mode = 'Content-Security-Policy';
  state.domain = document.domain;
  state.enabled = false;
  state.mode = 'Content-Security-Policy';
  state.policy = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; font-src 'self';";
  state.report = '';
  return state;
}

function getProject(domain, next) {
  $.post('https://caspr.io/api/projects', {name: 'enforcer - ' + domain}, function(data) {
    next(data);
  });
}

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {


    var out = [];

    if (details.type !== 'main_frame') {
      return;
    }

    var matches = details.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = matches && matches[1];

    if (domain === null) {
      return;
    }

    if (!(domain in states)) {
      states[domain] = defaultState();
    }

    var state = states[domain];
    var policyString = state.policy + '; report-uri ' + state.report;

    if (!state.enabled) {
      return { responseHeaders: details.responseHeaders };
    }

    out.push({name: state.mode, value: policyString});

    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy' || details.responseHeaders[i].name.toLowerCase() === 'content-security-policy-report-only') {
        // ignore previous content-security-policy
        continue;
      }
      out.push(details.responseHeaders[i]);
    }
    return { responseHeaders: out };
  }, { urls: [ '<all_urls>']}, [ 'blocking', 'responseHeaders']);

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(request) {
      var domain = request.domain;
      if (request.greeting === 'getState' ) {
        if (!(domain in states)) {
          states[domain] = defaultState();
        }
        port.postMessage( { state: states[domain] } );
      }

      if (request.greeting === 'setState') {
        states[domain] = request.state;
      }

      if (request.greeting === 'getEndpoint') {
        if (!(domain in states)) {
          states[domain] = defaultState();
        }
        getProject(domain, function(project) {
          states[domain].enabled = true;
          states[domain].project = project;
          states[domain].report = 'https://caspr.io/endpoint/' + project.endpoint;
          port.postMessage( {state: states[domain] } );
        });
      }
  });
});
