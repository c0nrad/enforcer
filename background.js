'use strict';

// Array to hold callback functions
var callbacks = [];

// // This function is called onload in the popup code
// function getPageInfo(callback) {
//     // Add the callback to the queue
//     callbacks.push(callback);
//     // Inject the content script into the current page
//     chrome.tabs.executeScript(null, { file: 'content_script.js' });
// };
//
// // Perform the callback when a request is received from the content script
// chrome.extension.onMessage.addListener(function(request)  {
//     // Get the first callback in the callbacks array
//     // and remove it from the array
//     console.log(request);
//     var callback = callbacks.shift();
//     // Call the callback function
//     callback(request);
// });

console.log('I AM BACKGROUND');

var POLICY = "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; font-src 'self'; report-uri http://localhost:3000/endpoint/ad82cb7bb6fbdc4fa58a78b8e4efdfb4348ad2d1d7305015b3f4901b9d8b5836"

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    var out = []
    out.push({name: 'Content-Security-Policy', value: POLICY});

    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name === 'Server') {
        console.log("SCORE");
      }
      out.push(details.responseHeaders[i]);

    }
    console.log(JSON.stringify(out));
    return { responseHeaders: out };
  }, { urls: [ "<all_urls>"]}, [ "blocking", "responseHeaders"]);
