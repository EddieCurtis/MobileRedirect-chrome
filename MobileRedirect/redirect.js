chrome.webNavigation.onBeforeNavigate.addListener(function(request) {
  var regex = /.*:\/.*(\/|\.)(m|mobile)\..*\/.*/i;
  
  if(request.url.match(regex)) {
    console.log(request.url);
    if (shouldRedirect(request.url)) {
      var newUrl = request.url.replace(/(m|mobile)\./i, "");
      //TODO: I think this only works after the tab has been loaded, find a better way.
      chrome.tabs.update(request.tabid, {url:newUrl});
    }
  }
});

var shouldRedirect = function (urlString) {
  var storageKey = getStorageString(urlString);
  var savedValue = chrome.storage.sync.get(storageKey, function() {});
  
  if (savedValue == "false") {
    return false;
  }
  if (savedValue == null) {
    chrome.storage.sync.set({storageKey:"true"});
    // TODO: Add callback where user has option to disable it for this url
    if (false) {
      chrome.storage.sync.set({storageKey:"false"});
    }
  }
  return true;
}

var getStorageString = function (key) {
  return "uk.co.uitwaaien.mobileredirect." + key;
}