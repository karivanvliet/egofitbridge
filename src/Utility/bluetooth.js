export async function bluetoothConnect() {
  const customService = '0000fff0-0000-1000-8000-00805f9b34fb';
  const notifyUUID = '0000fff1-0000-1000-8000-00805f9b34fb';
  // pairing to device
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [customService],
  });
  console.log('Connecting to GATT Server...');
  const server = await device.gatt.connect();

  // getting service and turning on notify characteristic
  console.log('Getting Custom Service...');
  const pService = await server.getPrimaryService('0000fff0-0000-1000-8000-00805f9b34fb');

  console.log('Getting  Notify Characteristic...');
  const notifyChar = await pService.getCharacteristic(notifyUUID);
  await notifyChar.startNotifications();
  console.log('Notifications started');

  return ([server, pService, notifyChar]);
}

export async function bluetoothRequest(service) {
  const requestUUID = '0000fff2-0000-1000-8000-00805f9b34fb';
  const requestValue = '02515103';
  const typedArray = new Uint8Array(requestValue.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));
  // console.log(typedArray);
  const { buffer } = typedArray;

  // setting value of request characteristic
  // console.log('getting request characteristic')
  const requestChar = await service.getCharacteristic(requestUUID);
  // console.log('writing value to request char')
  await requestChar.writeValueWithoutResponse(buffer);
  // console.log('written')
}

export async function bluetoothDisconnect(server) {
  server.disconnect();
}
