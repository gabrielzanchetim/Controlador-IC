import React, { useState, useEffect } from 'react';
import {View, ScrollView, Text, Image, PermissionsAndroid, Platform, TouchableOpacity, Alert} from 'react-native';
import RNBluetoothClassic, { BluetoothDevice, } from 'react-native-bluetooth-classic';
import { stylesConexao } from './src/EstilosPaginaConexao.tsx'
import { stylesConectado } from './src/EstilosPaginaConectado.tsx';

const BluetoothClassicTerminal = () => {
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice>();
  const [receivedMessage, setReceivedMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [selectPercentageOption, setselectPercentageOption] = useState<number | null>(null);
  const [selectTimeOption, setSelectTimeOption] = useState<number | null>(null);
  const [estado, setEstado] = useState(0);
  const [selectOperationTime, setselectOperationTime] = useState<number | null>(null);
  const [selectRestanteTime, setselectRestanteTime] = useState<number | null>(null);
  const [selectOperandoOption, setSelectOperandoOption] = useState<number | null>(null);
  const [infoCommandSent, setInfoCommandSent] = useState(false);

  {/* Comandos bluetooth*/ }

  const checkBluetoothEnabled = async () => {
    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }
    } catch (error) {
      console.error('Bluetooth não está ligado nesse dispositivo.');
    }
  };

  const sendCommandToArduino = async (command: string) => {
    if (selectedDevice && isConnected) {
      try {
        await selectedDevice.write(command); // Envia o comando para o Arduino
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const startDeviceDiscovery = async () => {
    console.log("searching for devices...");
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      console.log("Bonded peripherals: " + paired.length);
      setPaired(paired);
    } catch (error) {
      console.error('Error bonded devices:', error);
    }
  }

  const connectToDevice = async (device: BluetoothDevice) => {
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
      console.log("is connected : ", isConnected);
    } catch (error) {
      Alert.alert(
        "Erro de Conexão",
        "O dispositivo que você tentou acessar está ocupado ou indisponível, tente novamente",
        [{ text: "OK" }]
      );
    }
  }

  const readData = async () => {
    if (selectedDevice && isConnected) {
      try {
        let message = await selectedDevice.read();
        if (message) {
          message = message.trim();
          if (message !== "" && message !== " ") {
            if (receivedMessage.length > 300) {
              setReceivedMessage("");
            }
            setReceivedMessage(receivedMessage => receivedMessage + message + "\n");

            // Teste para ver se mensagem é do tipo regex
            const regex = /level:(\d+),tempo:(\d+),estado:(\d+)/;
            const match = message.match(regex);

            if (match) {
              const level = parseInt(match[1], 10);
              const tempo = parseInt(match[2], 10);
              const estado = parseInt(match[3], 10);

              if (estado == 5) {
                setSelectOperandoOption(1);
              } else if (estado == 2) {
                setSelectOperandoOption(0);
              }

              // Update the states with the parsed values
              setselectPercentageOption(level);
              setSelectTimeOption(tempo);
              setEstado(estado); // Atualiza a variável de estado "estado"
            }

            // Teste para ver se mensagem é do tipo regex2
            const regex2 = /operando:(\d+),restante:(\d+)/;
            const match2 = message.match(regex2);

            if (match2) {
              const operando = parseInt(match2[1], 10);
              const restante = parseInt(match2[2], 10);

              // Update the states with the parsed values
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

  const disconnect = () => {
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
  }

  const increaseGeneration = () => {
    setselectPercentageOption(prevOption => {
      const newOption = (prevOption === 4 ? 1 : prevOption === 1 ? 2 : prevOption === 2 ? 3 : 4);
      sendCommandToArduino(`level:${newOption},tempo:${selectTimeOption},estado:${estado}`);
      return newOption;
    });
  };

  const increaseTime = () => {
    setSelectTimeOption(prevOption => {
      const newOption = (prevOption === 4 ? 1 : prevOption === 1 ? 2 : prevOption === 2 ? 3 : 4);
      sendCommandToArduino(`level:${selectPercentageOption},tempo:${newOption},estado:${estado}`);
      return newOption;
    });
  };

  const getImageSource = () => {
    switch (selectPercentageOption) {
      case 1:
        return require('./assets/images/25.png');
      case 2:
        return require('./assets/images/50.png');
      case 3:
        return require('./assets/images/75.png');
      case 4:
        return require('./assets/images/100.png');
      default:
        return null; // Ou uma imagem padrão, se preferir
    }
  };

  const formatTime = (timeInSeconds: number | null) => {
    if (selectTimeOption == 4) return "--:--"
    if (timeInSeconds === null) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getInitialTime = (timeOption: number | null) => {
    switch (timeOption) {
      case 3:
        return 10; // 10 seconds
      case 2:
        return 4; // 4 seconds
      case 1:
        return 2; // 2 seconds
      default:
        return 0;
    }
  };

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timer | undefined;
    if (selectedDevice && isConnected) {
      intervalId = setInterval(() => readData(), 100);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, selectedDevice]);

  useEffect(() => {
    async function requestBluetoothPermission() {
      try {
        const grantedLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Fine Location Permission',
            message: 'This app needs to know location of device.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );

        if (grantedLocation === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Bluetooth permissions granted');
        } else {
          console.log('Bluetooth permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }

    checkBluetoothEnabled();

    requestBluetoothPermission().then(() => {
      startDeviceDiscovery();
    });
  }, [])

  useEffect(() => {
    if (selectedDevice && isConnected && !infoCommandSent) {
      const timeoutId = setTimeout(() => {
        sendCommandToArduino('INFO');
        setInfoCommandSent(true);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedDevice, isConnected, infoCommandSent]);

  useEffect(() => {
    if (selectTimeOption !== null) {
      const initialTime = getInitialTime(selectTimeOption);
      setselectRestanteTime(initialTime);
    }
  }, [selectTimeOption]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (selectOperandoOption === 1 && selectRestanteTime !== null) {
      intervalId = setInterval(() => {
        setselectRestanteTime(prevTime => {
          if (prevTime !== null && prevTime > 0) {
            return prevTime - 1;
          } else {
            if (intervalId) clearInterval(intervalId);
            return prevTime;
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectOperandoOption, selectRestanteTime]);


  return (
    <View style={stylesConexao.containerGeral}>
      <Text style={stylesConexao.tituloAplicativo}>Controlador</Text>
      <ScrollView>
        {/*Tela de conexão*/}
        {!isConnected && (
          <>
            <View style={stylesConexao.containerTelaConexao}>
              <TouchableOpacity
                onPress={() => startDeviceDiscovery()}
                style={[stylesConexao.botaoAtualizaLista]}>
                <Text style={[stylesConexao.textoBotaoScan,]}>Atualizar lista</Text>
                <Text style={[stylesConexao.botaoAtualizarLista,]}>↻</Text>
              </TouchableOpacity>
              <Text style={[stylesConexao.tituloListaDispositivos,]}>Dispositivos conectados:</Text>
              {paired.map((pair: BluetoothDevice, i) => (
                <View key={i}
                  style={[stylesConexao.containerListaDispositivos]}>
                  <View>
                    <Text style={stylesConexao.nomeDispositivoLista}>{pair.name}</Text>
                    <Text style={stylesConexao.dispositivoId}>{pair.id}</Text>
                  </View>
                  <TouchableOpacity onPress={() => connectToDevice(pair)} style={[stylesConexao.botaoConectar]}>
                    <Text style={[stylesConexao.textoBotaoConectar]}>Conectar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {/*Tela após conectado*/}
        {selectedDevice && isConnected && (
          <>
            {/*Dispositivo conectado e botão para desconectar*/}
            <View style={[stylesConectado.containerBotaoDesconectar]}>
              <TouchableOpacity
                onPress={() => disconnect()} style={[stylesConectado.botaoDesconectar]}>
                <Text style={stylesConectado.textoBotaoDesconectar}>Desconectar</Text>
              </TouchableOpacity>
            </View>

            {/*Lista de opções de Porcentagem e Tempo*/}
            <View style={stylesConectado.containerMaquina}>
              <View style={stylesConectado.blocosLateraisMaquina}>
                <Text style={stylesConectado.geracaoEtempo}>Geração</Text>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setselectPercentageOption(4); sendCommandToArduino(`level:4,tempo:${selectTimeOption},estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.textoCadaOpcao}>100%</Text>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectPercentageOption === 4 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setselectPercentageOption(3); sendCommandToArduino(`level:3,tempo:${selectTimeOption},estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.textoCadaOpcao}>75%</Text>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectPercentageOption === 3 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setselectPercentageOption(2); sendCommandToArduino(`level:2,tempo:${selectTimeOption},estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.textoCadaOpcao}>50%</Text>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectPercentageOption === 2 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setselectPercentageOption(1); sendCommandToArduino(`level:1,tempo:${selectTimeOption},estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.textoCadaOpcao}>25%</Text>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectPercentageOption === 1 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                {/*Botão +*/}
                <TouchableOpacity style={stylesConectado.botaoMais} onPress={increaseGeneration}>
                  <Text style={stylesConectado.textoBotaoMais}>+</Text>
                </TouchableOpacity>

                {/*Operando*/}
                <View style={[stylesConectado.cadaOpcaoMaquina]}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.textoCadaOpcao}>Ligado</Text>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectOperandoOption === 1 ? '🟢' : '⚪'}</Text>
                  </View>
                </View>

              </View>

              <View style={stylesConectado.blocosLateraisMaquina}>
                <Text style={stylesConectado.geracaoEtempo}>Tempo</Text>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelectTimeOption(4); sendCommandToArduino(`level:${selectPercentageOption},tempo:4,estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectTimeOption === 4 ? '🟢' : '⚪'}</Text>
                    <Text style={stylesConectado.textoCadaOpcao}>Direto</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelectTimeOption(3); sendCommandToArduino(`level:${selectPercentageOption},tempo:3,estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectTimeOption === 3 ? '🟢' : '⚪'}</Text>
                    <Text style={stylesConectado.textoCadaOpcao}>10h</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelectTimeOption(2); sendCommandToArduino(`level:${selectPercentageOption},tempo:2,estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectTimeOption === 2 ? '🟢' : '⚪'}</Text>
                    <Text style={stylesConectado.textoCadaOpcao}>4h</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelectTimeOption(1); sendCommandToArduino(`level:${selectPercentageOption},tempo:1,estado:${estado}`); }}>
                  <View style={[stylesConectado.opcaoEled]}>
                    <Text style={stylesConectado.botaoBrancoVerde}>{selectTimeOption === 1 ? '🟢' : '⚪'}</Text>
                    <Text style={stylesConectado.textoCadaOpcao}>2h</Text>
                  </View>
                </TouchableOpacity>

                {/*Botão +*/}
                <TouchableOpacity style={stylesConectado.botaoMais} onPress={increaseTime}>
                  <Text style={stylesConectado.textoBotaoMais}>+</Text>
                </TouchableOpacity>

                {/*Botão de ligar*/}
                <TouchableOpacity
                  onPress={() => selectOperandoOption === 0 ? sendCommandToArduino(`level:${selectPercentageOption},tempo:${selectTimeOption},estado:5`) : sendCommandToArduino(`STOP`)}
                  style={stylesConectado.botaoLigar}>
                  <Text style={stylesConectado.textoBotaoLigar}>{selectOperandoOption === 0 ? 'Ligar' : 'Desligar'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={stylesConectado.informacoesSelecionadas}>
              {selectTimeOption && (
                <Image source={getImageSource()} style={stylesConectado.imagens} 
                />
              )}
              {selectTimeOption && (
                <View style={stylesConectado.containerContador}>
                  <Text style={stylesConectado.textoContador}>
                    {formatTime(selectRestanteTime)}
                  </Text>
                </View>
              )}
            </View>

            {/* 
            <View style={styles.messageContainer}>
              <ScrollView>
                <Text>{receivedMessage}</Text>
              </ScrollView>
            </View>
            */}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default BluetoothClassicTerminal;
