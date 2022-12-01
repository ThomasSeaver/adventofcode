for (let i = 1; i <= 1; i++) {
  let A = [];
  let X = [];
  for (let j = 1; j < i * 100; j++) {
    A.push(parseInt(Math.random() * 100000));
    const start = ((j - 1) * 100000) / (i * 100);
    const partial = Math.random() * (100000 / (i * 100));
    X.push(parseInt(start + partial));
  }
  console.log(`([${A}], [${X}])`);
}
