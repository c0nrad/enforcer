'use strict';

var chrome = chrome || {};
var policy = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; font-src 'self'; report-uri http://localhost:3000/endpoint/ad82cb7bb6fbdc4fa58a78b8e4efdfb4348ad2d1d7305015b3f4901b9d8b5836"
var enabled = true;

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    var out = [];
    console.log('using policy', policy);

    if (enabled) {
      out.push({name: 'Content-Security-Policy', value: policy});
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
    if( request.greeting === 'getPolicy' ) {
      sendResponse( {policy:policy} );
    }
    if (request.greeting === 'getEnabled' ) {
      sendResponse( {enabled: enabled } );
    }
    if (request.greeting === 'setPolicy' ) {
      console.log('setting policy to', request.policy);
      policy = request.policy;
    }
    if (request.greeting === 'setEnabled') {
      console.log('enabled', request.enabled);
      enabled = request.enabled;
    }
});
