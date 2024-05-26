import { PermissionsAndroid, Platform, Alert } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

// Enable Bluetooth
export const checkBluetoothEnabled = async () => {
  try {
    const enabled = await RNBluetoothClassic.isBluetoothEnabled();
    if (!enabled) {
      await RNBluetoothClassic.requestBluetoothEnabled();
    }
  } catch (error) {
    console.error('Bluetooth não está ligado nesse dispositivo.');
  }
};

// Send Command to Arduino
export const sendCommandToArduino = async (
  command: string, 
  selectedDevice: BluetoothDevice | undefined, 
  isConnected: boolean
) => {
  if (selectedDevice && isConnected) {
    try {
      await selectedDevice.write(command);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

// Start Device Discovery
export const startDeviceDiscovery = async (setPaired: React.Dispatch<React.SetStateAction<any[]>>) => {
  console.log("searching for devices...");
  try {
    const paired = await RNBluetoothClassic.getBondedDevices();
    console.log("Bonded peripherals: " + paired.length);
    setPaired(paired);
  } catch (error) {
    console.error('Error bonded devices:', error);
  }
};

// Connect to Device
export const connectToDevice = async (
  device: BluetoothDevice, 
  setSelectedDevice: React.Dispatch<React.SetStateAction<BluetoothDevice | undefined>>, 
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    console.log("Connecting to device");
    let connection = await device.isConnected();
    if (!connection) {
      await device.connect({
        connectorType: "rfcomm",
        DELIMITER: "\n",
        DEVICE_CHARSET: Platform.OS === "ios" ? 1536 : "utf-8",
      });
    }
    setSelectedDevice(device);
    setIsConnected(true);
  } catch (error) {
    Alert.alert(
      "Erro de Conexão",
      "O dispositivo que você tentou acessar está ocupado ou indisponível, tente novamente",
      [{ text: "OK" }]
    );
  }
};

// Read Data
export const readData = async (
  selectedDevice: BluetoothDevice | undefined, 
  isConnected: boolean,
  setReceivedMessage: React.Dispatch<React.SetStateAction<string>>,
  setselectPercentageOption: React.Dispatch<React.SetStateAction<number | null>>,
  setSelectTimeOption: React.Dispatch<React.SetStateAction<number | null>>,
  setEstado: React.Dispatch<React.SetStateAction<number>>,
  setSelectOperandoOption: React.Dispatch<React.SetStateAction<number | null>>,
  setselectOperationTime: React.Dispatch<React.SetStateAction<number | null>>,
  setselectRestanteTime: React.Dispatch<React.SetStateAction<number | null>>
) => {
  if (selectedDevice && isConnected) {
    try {
      let message = await selectedDevice.read();
      if (message) {
        message = message.trim();
        if (message !== "" && message !== " ") {
          setReceivedMessage(prevMessage => prevMessage.length > 300 ? message + "\n" : prevMessage + message + "\n");

          const regex = /level:(\d+),tempo:(\d+),estado:(\d+)/;
          const match = message.match(regex);

          if (match) {
            const level = parseInt(match[1], 10);
            const tempo = parseInt(match[2], 10);
            const estado = parseInt(match[3], 10);

            if (estado === 5) {
              setSelectOperandoOption(1);
            } else if (estado === 2) {
              setSelectOperandoOption(0);
            }

            setselectPercentageOption(level);
            setSelectTimeOption(tempo);
            setEstado(estado);
          }

          const regex2 = /operando:(\d+),restante:(\d+)/;
          const match2 = message.match(regex2);

          if (match2) {
            const operando = parseInt(match2[1], 10);
            const restante = parseInt(match2[2], 10);

            setselectOperationTime(operando);
            setselectRestanteTime(restante);
          }
        }
      }
    } catch (error) {
      console.error('Error reading message:', error);
    }
  }
};

// Disconnect from Device
export const disconnect = (
  selectedDevice: BluetoothDevice | undefined, 
  isConnected: boolean,
  setSelectedDevice: React.Dispatch<React.SetStateAction<BluetoothDevice | undefined>>,
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setReceivedMessage: React.Dispatch<React.SetStateAction<string>>,
  intervalId: NodeJS.Timer | undefined,
  setIntervalId: React.Dispatch<React.SetStateAction<NodeJS.Timer | undefined>>
) => {
  if (selectedDevice && isConnected) {
    try {
      clearInterval(intervalId);
      setIntervalId(undefined);

      selectedDevice.clear().then(() => {
        console.log("BT buffer cleared");
      });

      selectedDevice.disconnect().then(() => {
        setSelectedDevice(undefined);
        setIsConnected(false);
        setReceivedMessage("");
        console.log("Disconnected from device");
      });

    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }
};
