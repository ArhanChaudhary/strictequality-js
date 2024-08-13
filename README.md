# strictequality-js

strictequality-js is a homemade implementation of the strict equality operator in JavaScript (===) that follows the [isStrictlyEqual](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal) TC39 specification. It currently only works on Chrome versions less than v104. Read this project's corresponding blog on my website https://arhan.sh/blog/implementing-in-javascript-from-scratch/

# Installation

Load this directory as a chrome extension as demonstrated here https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked

# Usage

```js
// strictEquality is NOT async-safe (ie you must always `await` it)
await strictEquality(42, 42); // true
await strictEquality([], []); // false
await strictEquality(a = [], a); // true
```