function parseData(rawData) {
  const newTreadmillData = {};
  const valueArray = [];
  for (let i = 0; i < rawData.byteLength; i += 1) {
    valueArray.push((`00${rawData.getUint8(i).toString(16)}`).slice(-2));
  }

  if (valueArray.length === 17) {
    newTreadmillData.speed = parseInt(valueArray[3], 16) / 10;
    newTreadmillData.distance = parseInt(valueArray[8] + valueArray[7], 16) / 1000;
    newTreadmillData.calories = parseInt(valueArray[10] + valueArray[9], 16) / 10;
    newTreadmillData.sessionTimeSec = parseInt(valueArray[6] + valueArray[5], 16);
    newTreadmillData.steps = parseInt(valueArray[12] + valueArray[11], 16);
  }

  return newTreadmillData;
}

export default parseData;
