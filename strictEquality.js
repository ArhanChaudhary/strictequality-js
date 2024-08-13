async function strictEquality(obj1, obj2) {
  window.__obj1 = obj1;
  window.__obj2 = obj2;
  document.dispatchEvent(new CustomEvent("strictEquality"));
  let e = await new Promise((resolve) =>
    document.addEventListener("strictEqualityResponse", resolve, { once: true })
  );
  delete window.__obj1;
  delete window.__obj2;
  if (e.detail.length) {
    throw new Error(e.detail);
  } else {
    return e.detail;
  }
}
