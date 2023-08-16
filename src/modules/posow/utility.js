const generateId = (counter, posow) => {
  if (counter < 10) {
    posow += "000";
  } else if (counter < 100) {
    posow += "00";
  } else if (counter < 1000) {
    posow += "0";
  }
  return posow + counter;
};

module.exports = { generateId };
