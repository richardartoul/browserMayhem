// function resetDefaultSuggestion() {
// 	chrome.omnibox.setDefaultSuggestion({
// 		description: 'Search this repository'
// 	})
// };

// resetDefaultSuggestion;



// chrome.omnibox.onInputEntered.addListener(function(text) {

// 	//need to switch this all to a contentScript not background.js
// 	var response = $.get("http://www.physiciankickbacks.com");
// 	console.dir(response);

// 	//check the DOM for the <tbody> tag, it contains all the folders / files

// 	//recursive function. Iterate through all <tr> tags
// 		//(once you're inside <tr>, go to <td class="content"> then <a> and extract href)
		
// 		//if <tr> was a folder then continue to recurse on all the files or folders
		
// 		// if <tr> was a file, then iterate through all the elements to assemble the
// 		//code into a text file
// 	//for files

// });


// function navigate(url) {
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 		chrome.tabs.update(tabs[0].id, {url:url});
// 	});
// }