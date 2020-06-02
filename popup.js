function summarize() {
    // chrome.runtime.sendMessage({text: "button"}, function(response) {
    //     console.log(response);
    //   });
    console.log('highlighting!');
	chrome.tabs.executeScript(null, { file: "jquery-3.5.1.min.js" }, function() {
            document.getElementById('startbtn').innerHTML = "Stop";
            document.getElementById('directions').style.visibility = 'visible';
            chrome.tabs.executeScript(null, { file: "content.js" }, updateResults);
        });
}


function updateResults(resultArr) {
    console.log("results!");
    console.log(resultArr);
    // here is where you output stuff/update the extension popup 
    document.getElementById('found').innerHTML = "<b>"+resultArr[0]+"</b>";
    document.getElementById('found').style.visibility = 'visible';
    document.getElementById('directions').style.visibility = 'hidden';
}
document.getElementById('startbtn').addEventListener('click', summarize);

// window.onload = function() {
//     chrome.runtime.sendMessage({text: "status"}, function(response) {
//         document.getElementById('startbtn').innerHTML = "Start";
//       });
// }