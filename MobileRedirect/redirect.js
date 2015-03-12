chrome.webNavigation.onBeforeNavigate.addListener(function(request) {
  var regex = /.*:\/.*(\/|\.)(m|mobile)\..*\/.*/i;
  
  if(request.url.match(regex)) {
    console.log(request.url);
    if (shouldRedirect(request.url)) {
      var newUrl = request.url.replace(/(m|mobile)\./i, "");
      chrome.tabs.query({'active': true}, function(tabs) {
        chrome.tabs.update(request.tabId, {url:newUrl});
      });
    }
  }
});

var notificationOptions = {
    type:'basic',
    title:'Mobile Redirect',
    message:'Redirecting to non-mobile version of this site.',
    iconUrl:'icon.png',
    buttons : [
                { title:'Add exception' } ,
                { title:'Ignore' }
              ]
}

var shouldRedirect = function (urlString) {
  var storageKey = getStorageString(urlString);
  var savedValue = chrome.storage.sync.get(storageKey, function(items) {
    //TODO retrieve the value from the items object
    console.log(items);
  });
  
  if (savedValue == "false") {
    return false;
  }
  if (savedValue == null) {
    var obj = {};
    obj[storageKey] = "true";
    // TODO: Add callback where user has option to disable it for this url
    chrome.notifications.create('notificationId', notificationOptions, function(id) {});
    if (false) {
      obj[storageKey] = "false";
    }
    chrome.storage.sync.set(obj);
  }
  return true;
}

var getStorageString = function (key) {
  // Domain name, e.g. "m.wikipedia.org"
  var domain = key.replace(/.*:\/\//i, "").replace(/\/.*/i,"");
  return "uk.co.uitwaaien.mobileredirect." + domain;
}
