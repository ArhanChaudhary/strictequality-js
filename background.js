async function onContentMessage(_, sender, sendResponse) {
  let tabId = sender.tab.id;

  await new Promise((resolve) =>
    chrome.debugger.attach({ tabId }, "1.3", resolve)
  );

  await chrome.debugger.sendCommand({ tabId }, "HeapProfiler.takeHeapSnapshot");
  let objDetails = await Promise.all([
    chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
      expression: "window.__obj1",
    }),
    chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
      expression: "window.__obj2",
    }),
  ]);

  let objHeapDetails;
  try {
    objHeapDetails = await Promise.all([
      chrome.debugger.sendCommand({ tabId }, "HeapProfiler.getHeapObjectId", {
        objectId: objDetails[0].result.objectId,
      }),
      chrome.debugger.sendCommand({ tabId }, "HeapProfiler.getHeapObjectId", {
        objectId: objDetails[1].result.objectId,
      }),
    ]);
  } catch (e) {
    await chrome.debugger.detach({ tabId: sender.tab.id });
    sendResponse(primitiveEquality(objDetails[0].result, objDetails[1].result));
    return;
  }
  await chrome.debugger.detach({ tabId: sender.tab.id });
  sendResponse(
    stringEquality(
      objHeapDetails[0].heapSnapshotObjectId,
      objHeapDetails[1].heapSnapshotObjectId
    )
  );
}

function stringEquality(str1, str2) {
  if (str1.length - str2.length) {
    return false;
  }
  for (let i = 0; i < str1.length; i++) {
    if (str1.charCodeAt(i) - str2.charCodeAt(i)) {
      return false;
    }
  }
  return true;
}

function primitiveEquality(p1, p2) {
  if (p1.subtype) {
    p1.type = p1.subtype;
  }
  if (p2.subtype) {
    p2.type = p2.subtype;
  }
  if (!stringEquality(p1.type, p2.type)) {
    return false;
  }
  if (stringEquality(p1.type, "number")) {
    if (
      stringEquality(p1.description, "NaN") ||
      stringEquality(p2.description, "NaN")
    ) {
      return false;
    }
    if (
      (stringEquality(p1.description, "0") &&
        stringEquality(p2.description, "-0")) ||
      (stringEquality(p1.description, "-0") &&
        stringEquality(p2.description, "0"))
    ) {
      return true;
    }
    if (p1.unserializableValue || p2.unserializableValue) {
      return stringEquality(p1.description, p2.description);
    }
    return !(p1.value - p2.value);
  }
  if (stringEquality(p1.type, "null") || stringEquality(p1.type, "undefined")) {
    return true;
  }
  if (stringEquality(p1.type, "bigint")) {
    return stringEquality(p1.description, p2.description);
  }
  if (stringEquality(p1.type, "string")) {
    return stringEquality(p1.value, p2.value);
  }
  if (stringEquality(p1.type, "boolean")) {
    return !(p1.value - p2.value);
  }
  throw new Error("Unsupported primitive type");
}

chrome.runtime.onMessage.addListener(function () {
  onContentMessage(...arguments);
  return true;
});
