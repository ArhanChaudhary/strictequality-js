# strictequality-js

strictequality-js is a [spec-compliant](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal) implementation of the strict equality operator in JavaScript (===) from scratch. It utilizes the Chrome Debugging Protocol and the heap profiler for object equality, and currently only works on Chromium version [v103](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac_Arm/1002918/).

Read this project's corresponding blog on my website https://arhan.sh/blog/implementing-strict-equality-in-javascript-from-scratch/

# Installation

Load this directory as a chrome extension as demonstrated here https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked

# Usage

```js
// strictEquality is NOT async-safe (ie you must always `await` it)
await strictEquality(42, 42); // true
await strictEquality([], []); // false
await strictEquality(a = [], a); // true
```