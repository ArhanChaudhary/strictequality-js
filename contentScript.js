document.addEventListener("strictEquality", async function () {
  document.dispatchEvent(
    new CustomEvent("strictEqualityResponse", {
      detail: await chrome.runtime.sendMessage(undefined),
    })
  );
});

let script = document.createElement("script");
script.src = chrome.runtime.getURL("strictEquality.js");
script.onload = function () {
  this.remove();
  document.dispatchEvent(new Event("strictEqualityLoaded"));
};
(document.head || document.documentElement).appendChild(script);
