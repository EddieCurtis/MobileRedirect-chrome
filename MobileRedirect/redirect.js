chrome.webNavigation.onBeforeNavigate.addListener(function(request) {
  var regex = /.*:\/.*(\/|\.)(m|mobile)\..*\/.*/i;
  
  if(request.url.match(regex)) {
    console.log(request.url);
    checkRedirect(request);
  }
});

var notificationOptions = {
    type:'basic',
    title:'Mobile Redirect',
    message:'Redirecting to non-mobile version of this site.',
    iconUrl:'icon.png',
    buttons : [
                { title:'Never redirect'},
                { title:'Always redirect'}
              ]
}

var checkRedirect = function (request) {
  var storageKey = getStorageString(request.url);
  var value = null;
  chrome.storage.sync.get(storageKey, function(items) {
    value = items[storageKey];
    if (value == null) {
      redirect(request);
      chrome.notifications.create('notificationId', notificationOptions, function(id) {});
      chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
         if (notificationId == 'notificationId') {
           var obj = {};
           if (buttonIndex == 0) {
              obj[storageKey] = "false";
           } else {
              obj[storageKey] = "true";
           }
           chrome.storage.sync.set(obj);
         }
      });
    } else if (value == "true") {
       redirect(request);
    }
  });
  return true;
}

var redirect = function(request) {
    var newUrl = request.url.replace(/(m|mobile)\./i, "");
      chrome.tabs.query({'active': true}, function(tabs) {
        chrome.tabs.update(request.tabId, {url:newUrl});
      });
}

var getStorageString = function (key) {
  // Domain name, e.g. "m.wikipedia.org"
  var domain = key.replace(/.*:\/\//i, "").replace(/\/.*/i,"");
  return "uk.co.uitwaaien.mobileredirect." + domain;
}
