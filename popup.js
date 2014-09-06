'use strict';
var chrome = chrome || {};



var app = angular.module('app', []);

app.controller('MainController', function($scope, $rootScope, Policy) {

  Policy.getPolicy();
  Policy.getEnabled();

  $scope.setPolicy = function() {
    console.log($scope.policy);
    Policy.setPolicy($scope.policy);
  };

  $scope.setEnabled = function() {
    console.log('set enabled', $scope.enabled);
    Policy.setEnabled($scope.enabled);
  };

});

app.service('Policy', function($rootScope) {
  var out = {};
  out.getPolicy = function() {
    chrome.extension.sendMessage({greeting: 'getPolicy'},
      function (response) {
          var policy = response.policy;
          $rootScope.$apply(function() {
            $rootScope.policy = policy;
          });
      });
  };

  out.getEnabled = function() {
    chrome.extension.sendMessage({greeting: 'getEnabled'},
      function (response) {
          var enabled = response.enabled;
          $rootScope.$apply(function() {
            $rootScope.enabled = enabled;
          });
      });
  };

  out.setPolicy = function(policy) {
    console.log('Setting policy!', policy);
    chrome.extension.sendMessage({greeting: 'setPolicy', policy: policy});
  };

  out.setEnabled = function(enabled) {
    chrome.extension.sendMessage({greeting: 'setEnabled', enabled: enabled});
  };

  return out;
});



// // This callback function is called when the content script has been
// // injected and returned its results
// function onPageInfo(o)  {
//     document.getElementById('title').value = o.title;
//     document.getElementById('url').value = o.url;
//     document.getElementById('summary').innerText = o.summary;
// }
//
// // Global reference to the status display SPAN
// var statusDisplay = null;
//
// // POST the data to the server using XMLHttpRequest
// function addBookmark() {
//     // Cancel the form submit
//     event.preventDefault();
//
//     // The URL to POST our data to
//     var postUrl = 'http://post-test.local.com';
//
//     // Set up an asynchronous AJAX POST request
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', postUrl, true);
//
//     // Prepare the data to be POSTed
//     var title = encodeURIComponent(document.getElementById('title').value);
//     var url = encodeURIComponent(document.getElementById('url').value);
//     var summary = encodeURIComponent(document.getElementById('summary').value);
//     var tags = encodeURIComponent(document.getElementById('tags').value);
//
//     var params = 'title=' + title +
//                  '&url=' + url +
//                  '&summary=' + summary +
//                  '&tags=' + tags;
//
//     // Replace any instances of the URLEncoded space char with +
//     params = params.replace(/%20/g, '+');
//
//     // Set correct header for form data
//     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//
//     // Handle request state change events
//     xhr.onreadystatechange = function() {
//         // If the request completed
//         if (xhr.readyState == 4) {
//             statusDisplay.innerHTML = '';
//             if (xhr.status == 200) {
//                 // If it was a success, close the popup after a short delay
//                 statusDisplay.innerHTML = 'Saved!';
//                 window.setTimeout(window.close, 1000);
//             } else {// Show what went wrong
//                 statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
//             }
//         }
//     };
//
//     // Send the request and set status
//     xhr.send(params);
//     statusDisplay.innerHTML = 'Saving...';
// }

// function getPolicy() {
//   chrome.extension.sendMessage({greeting: 'getPolicy'},
//       function (response) {
//           var policy = response.policy;
//           document.getElementById('policy').innerText = policy;
//       });
// }

// function setPolicy() {
//   var policy = document.getElementById('policy').innerText;
//   console.log('Sending policy', policy);
//   chrome.extension.sendMessage({policy: policy});
// }
//
// getPolicy();


// // When the popup HTML has loaded
// window.addEventListener('load', function(evt) {
//     // Handle the bookmark form submit event with our addBookmark function
//     document.getElementById('addbookmark').addEventListener('submit', addBookmark);
//     // Cache a reference to the status display SPAN
//     statusDisplay = document.getElementById('status-display');
//     // Call the getPageInfo function in the background page, injecting content_script.js
//     // into the current HTML page and passing in our onPageInfo function as the callback
//     chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);
// });
