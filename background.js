chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.query === "url") {
		var url;
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			console.log("tab identified:", tabs[0].url);
			sendResponse({url: tabs[0].url});
		});
	}
	/*this is very poorly documented in the chrome API, but the function must return true
	for the asynchronous response to work */
	return true;
});