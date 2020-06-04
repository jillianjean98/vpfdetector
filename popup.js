function summarize() {

    console.log('running!');
	chrome.tabs.executeScript(null, { file: "jquery-3.5.1.min.js" }, function() {
            document.getElementById('startbtn').style.display = 'none';
            document.getElementById('directions').style.display = 'inline';
            chrome.tabs.executeScript(null, { file: "content.js" });
        });
}

document.getElementById('startbtn').addEventListener('click', summarize);
