console.log("extension init");

var s = document.createElement('script');
s.src = chrome.extension.getURL("loadout.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head).appendChild(s);

console.log("extension end");