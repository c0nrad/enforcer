'use strict';

var chrome = chrome || {};

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
    //console.log('using state', state);
    //console.log('policyStr', policyString);

    if (state.enabled) {
      out.push({name: state.mode, value: policyString});
    }
    //console.log(out);

    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy' || details.responseHeaders[i].name.toLowerCase() === 'content-security-policy-report-only') {
        //console.log('Previous Policy Found');
        continue;
      }
      out.push(details.responseHeaders[i]);
    }
    return { responseHeaders: out };
  }, { urls: [ '<all_urls>']}, [ 'blocking', 'responseHeaders']);


chrome.extension.onMessage.addListener( function(request,sender,sendResponse) {
    console.log('Request greeting', request.greeting, request.domain, request.state);
    var domain = request.domain;
    if (request.greeting === 'getState' ) {
      if (!(domain in states)) {
        states[domain] = defaultState();
      }
      sendResponse( {state: states[domain] } );
    }

    if (request.greeting === 'setState') {
      states[domain] = request.state;
    }
});
