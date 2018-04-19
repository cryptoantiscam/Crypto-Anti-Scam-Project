function getToday(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}
var scams = 0;
var spams = 0;
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        var today = getToday();
        localStorage.setItem("currentday", today);
        localStorage.setItem("scams", 0);
        localStorage.setItem("spams", 0);
    }else if(details.reason == "update"){
        
    }
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(!changeInfo.url) return; // URL did not change
    chrome.browserAction.setBadgeText({text: "", tabId: tab.id});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	    chrome.tabs.sendMessage(tabs[0].id, {action: "reset"}, function(response) {});  
	});
});

chrome.runtime.onMessage.addListener(function (msg, sender,sendResponse) {
  if (msg.type === 'change' && msg.val) {
  	var currentday = localStorage.getItem('currentday');
  	var today = getToday();
  	if(today!=currentday){
  		if(msg.field=='scams'){
  			localStorage.setItem('scams',1);	
  		}else localStorage.setItem('spams',1);
  	}else{
  		var currentscams = localStorage.getItem('scams');
  		var currentspams = localStorage.getItem('spams');
  		if(msg.field=='scams'){
  			currentscams++;
  			localStorage.setItem('scams',currentscams);
  		}else {
  			currentspams++;
  			localStorage.setItem('spams',currentspams);
  		}
  	}
	chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
	chrome.browserAction.setBadgeText({text: ""+msg.val+"", tabId: sender.tab.id});
  }
});



