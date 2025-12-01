// I'm sure there are much cleverer functions than this, but these work :)
const getNextPrime = (number) => {
  let testNumber = number + 1;
  let isPrime = true;
  for (let divisor = 2; divisor < testNumber; divisor += 1) {
    if (testNumber % divisor === 0) {
      isPrime = false;
      break;
    }
  }
  return isPrime ? testNumber : getNextPrime(testNumber);
};

const primeFactorize = (number) => {
  let currentDivisor = getNextPrime(1);
  const primeMap = {};
  while (currentDivisor !== number) {
    if (number % currentDivisor === 0) {
      primeMap[currentDivisor] = primeMap[currentDivisor] === undefined ? 1 : primeMap[currentDivisor] + 1;
      number /= currentDivisor;
    } else {
      currentDivisor = getNextPrime(currentDivisor);
    }
  }
  primeMap[currentDivisor] = primeMap[currentDivisor] === undefined ? 1 : primeMap[currentDivisor] + 1;
  return primeMap;
};

module.exports = { getNextPrime, primeFactorize };
