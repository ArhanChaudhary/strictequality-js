let significantValues = [
  0,
  -0,
  1,
  0n,
  Symbol(),
  Math.PI,
  Number.MAX_SAFE_INTEGER,
  Number.MIN_SAFE_INTEGER,
  Number.MAX_SAFE_INTEGER + 1,
  Number.MIN_SAFE_INTEGER - 1,
  Infinity,
  -Infinity,
  NaN,
  null,
  undefined,
  true,
  false,
  "",
  {},
  [],
];

for (let i = 0; i < significantValues.length; i++) {
  for (let j = 0; j < significantValues.length; j++) {
    let obj1 = significantValues[i];
    let obj2 = significantValues[j];
    let expected = obj1 === obj2;
    let actual = await strictEquality(obj1, obj2);
    if (actual !== expected) {
      throw new Error(`Failed for ${obj1} and ${obj2}`);
    }
  }
}
