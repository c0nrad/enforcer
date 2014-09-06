'use strict';

var chrome = chrome || {};
var state = {};
state.mode = 'Content-Security-Policy';
state.domain = document.domain + "fuck";
state.enabled = false;
state.mode = 'Content-Security-Policy';
state.policy = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; font-src 'self';";
state.report = "http://caspr.io/endpoint/c2aaf0d6f6d93195b27365c1e14ef6cb2313c43c6890ecb0ef3de88672a82dd9";

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    var out = [];
    console.log('using state', state);

    if (state.enabled) {
      out.push({name: 'Content-Security-Policy', value: state.policy});
    }

    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name === 'Content-Security-Policy') {
        console.log('Previous Policy Found');
      }
      out.push(details.responseHeaders[i]);

    }
    return { responseHeaders: out };
  }, { urls: [ '<all_urls>']}, [ 'blocking', 'responseHeaders']);


chrome.extension.onMessage.addListener( function(request,sender,sendResponse) {
    console.log('Request greeting', request.greeting);

    if (request.greeting === 'getState' ) {
      sendResponse( {state: state } );
    }

    if (request.greeting === 'setState') {
      console.log('Updateing state', request.state);
      state = request.state;
    }
});
