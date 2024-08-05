import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, ScrollView, Text, Image, PermissionsAndroid, Platform, TouchableOpacity, Alert, Switch } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { estilosConectado, estilosConexao, estilosMensagens } from './src/Estilos.tsx';

const BluetoothClassicTerminal = () => {
  const [paired, setPaired] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice>();
  const [mensagensRecebidas, setMensagensRecebidas] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [estado, setEstado] = useState(0);
  const [selecionarOpcaoPorcentagem, setSelecionarOpcaoPorcentagem] = useState<number | null>(null);
  const [selecionarOpcaoTempo, setSelecionarOpcaoTempo] = useState<number | null>(null);
  const [selecionarTempoOperacao, setselecionarTempoOperacao] = useState<number | null>(0);
  const [selecionarTempoRestante, setselecionarTempoRestante] = useState<number | null>(null);
  const [selecionarOpcaoOperando, setselecionarOpcaoOperando] = useState<number | null>(null);
  const [comandoInfoEnviado, setComandoInfoEnviado] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

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

  const enviarComandoParaArduino = async (command: string) => {
    if (selectedDevice && isConnected) {
      try {
        await selectedDevice.write(command); // Envia o comando para o Arduino
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  const startDeviceDiscovery = async () => {
    console.log("Procurando dispositivos...");
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      console.log("Dispostivos pareados: " + paired.length);
      setPaired(paired);
    } catch (error) {
      console.error('Erro ao procurar dispositivos:', error);
    }
  }

  const connectToDevice = async (device: BluetoothDevice) => {
    setIsConnecting(true);
    try {
      console.log("Conectando ao dispositivo");
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
      console.log("Conectado : ", isConnected);
    } catch (error) {
      Alert.alert(
        "Erro de Conexão",
        "O dispositivo que você tentou acessar está ocupado ou indisponível, tente novamente",
        [{ text: "OK" }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const readData = async () => {
    if (selectedDevice && isConnected) {
      try {
        let mensagem = await selectedDevice.read();
        if (mensagem) {
          mensagem = mensagem.trim();
          if (mensagem !== "" && mensagem !== " ") {
            if (mensagensRecebidas.length > 300) {
              setMensagensRecebidas([]);
            }

            const timestamp = new Date().toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            setMensagensRecebidas(mensagensRecebidas => [...mensagensRecebidas, `${timestamp}: ${mensagem}`]);

            // Teste para ver o tipo de mensagem
            const regex = /nivel:(\d+),tempo:(\d+),estado:(\d+)/;
            const match = mensagem.match(regex);

            if (match) {
              const nivel = parseInt(match[1], 10);
              const tempo = parseInt(match[2], 10);
              const estado = parseInt(match[3], 10);

              if (estado == 5) {
                setselecionarOpcaoOperando(1);
                setIsSwitchOn(true);
              } else if (estado == 2) {
                setselecionarOpcaoOperando(0);
                setIsSwitchOn(false);
              }

              setSelecionarOpcaoPorcentagem(nivel);
              setSelecionarOpcaoTempo(tempo);
              setEstado(estado);
            }

            // Teste para ver o tipo de mensagem
            const regex2 = /operando:(\d+),restante:(\d+),nivel:(\d+),tempo:(\d+),estado:(\d+)/;
            const match2 = mensagem.match(regex2);

            if (match2) {
              const operando = parseInt(match2[1], 10);
              const restante = parseInt(match2[2], 10);
              const nivel = parseInt(match2[3], 10);
              const tempo = parseInt(match2[4], 10);
              const estado = parseInt(match2[5], 10);
              // Update the states with the parsed values
              setselecionarTempoOperacao(operando);
              setselecionarTempoRestante(restante);
              setSelecionarOpcaoPorcentagem(nivel);
              setSelecionarOpcaoTempo(tempo);

              if (estado == 5) {
                setselecionarOpcaoOperando(1);
                setIsSwitchOn(true);
              } else if (estado == 2) {
                setselecionarOpcaoOperando(0);
                setIsSwitchOn(false);
              }
            }
          }
        }
      } catch (error) {
        Alert.alert(
          "Erro de Conexão",
          "A conexão com o dispositivo foi perdida, confira se o aparelho está ligado, dentro do raio de operação e tente novamente",
          [{ text: "OK" }]
        );
        setSelectedDevice(undefined);
        setIsConnected(false);
        setMensagensRecebidas([]);
        console.log("Disconnected from device");
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
          setMensagensRecebidas([]);
          console.log("Desconectado do dispositivo");
        });

      } catch (error) {
        console.error('Erro ao desconectar:', error);
      }
    }
  }

  const aumentarGeracao = () => {
    setSelecionarOpcaoPorcentagem(prevOption => {
      const novaOpcao = (prevOption === 4 ? 1 : prevOption === 1 ? 2 : prevOption === 2 ? 3 : 4);
      enviarComandoParaArduino(`nivel:${novaOpcao},tempo:${selecionarOpcaoTempo},estado:${estado}`);
      return novaOpcao;
    });
  };

  const aumentarTempo = () => {
    setSelecionarOpcaoTempo(prevOption => {
      const novaOpcao = (prevOption === 4 ? 1 : prevOption === 1 ? 2 : prevOption === 2 ? 3 : 4);
      enviarComandoParaArduino(`nivel:${selecionarOpcaoPorcentagem},tempo:${novaOpcao},estado:${estado}`);
      return novaOpcao;
    });
  };

  const obterImagem = () => {
    switch (selecionarOpcaoPorcentagem) {
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

  const formatarTempo = (timeInSeconds: number | null) => {
    if (timeInSeconds === null) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTempoInicial = (timeOption: number | null) => {
    switch (timeOption) {
      case 3:
        return 10; // 10 seconds
      case 2:
        return 4; // 4 seconds
      case 1:
        return 2; // 2 seconds
      case 4:
        return 0; // Inicializa como 0 para "Direto"
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
        const grantedScan = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Bluetooth Scan Permission',
            message: 'This app needs Bluetooth Scan permission to discover devices.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        if (grantedLocation === PermissionsAndroid.RESULTS.GRANTED && grantedScan === PermissionsAndroid.RESULTS.GRANTED) {
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
    if (selectedDevice && isConnected && !comandoInfoEnviado) {
      const timeoutId = setTimeout(() => {
        enviarComandoParaArduino('INFO');
        setComandoInfoEnviado(true);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedDevice, isConnected, comandoInfoEnviado]);

  useEffect(() => {
    if (selecionarOpcaoTempo !== null) {
      const initialTime = getTempoInicial(selecionarOpcaoTempo);
      if (selecionarOpcaoTempo === 4) {
        setselecionarTempoOperacao(initialTime);
      } else {
        setselecionarTempoRestante(initialTime);
      }
    }
  }, [selecionarOpcaoTempo]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (selecionarOpcaoOperando === 1) {
      intervalId = setInterval(() => {
        if (selecionarOpcaoTempo === 4) {
          setselecionarTempoOperacao(prevTime => (prevTime !== null ? prevTime + 1 : 1));
        } else {
          setselecionarTempoRestante(prevTime => {
            if (prevTime !== null && prevTime > 0) {
              return prevTime - 1;
            } else {
              if (intervalId) clearInterval(intervalId);
              return prevTime;
            }
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selecionarOpcaoOperando, selecionarTempoRestante, selecionarOpcaoTempo]);

  const tratarAtualizacaoDeInformacao = () => {
    enviarComandoParaArduino('INFO');
  };

  const clearMessages = () => {
    setMensagensRecebidas([]);
  };

  const handleSwitchChange = (value: boolean) => {
    setIsSwitchOn(value);
    if (value) {
      enviarComandoParaArduino(`nivel:${selecionarOpcaoPorcentagem},tempo:${selecionarOpcaoTempo},estado:5`);
    } else {
      enviarComandoParaArduino(`STOP`);
    }
  };

  return (
    <View style={estilosConexao.containerGeral}>
      <Text style={estilosConexao.tituloAplicativo}>Controlador</Text>
      <ScrollView>
        {/*Tela de conexão*/}
        {!isConnected && (
          <>
            <View style={estilosConexao.containerTelaConexao}>
              <TouchableOpacity
                onPress={() => startDeviceDiscovery()}
                style={[estilosConexao.botaoAtualizaLista]}>
                <Text style={[estilosConexao.textoBotaoScan,]}>Atualizar lista</Text>
                <Text style={[estilosConexao.botaoAtualizarLista,]}>↻</Text>
              </TouchableOpacity>
              <Text style={[estilosConexao.tituloListaDispositivos,]}>Dispositivos conectados:</Text>
              {paired.map((pair: BluetoothDevice, i) => (
                <View key={i}
                  style={[estilosConexao.containerListaDispositivos]}>
                  <View>
                    <Text style={estilosConexao.nomeDispositivoLista}>{pair.name}</Text>
                    <Text style={estilosConexao.dispositivoId}>{pair.id}</Text>
                  </View>
                  <TouchableOpacity onPress={() => connectToDevice(pair)} style={[estilosConexao.botaoConectar]}>
                    <Text style={[estilosConexao.textoBotaoConectar]}>Conectar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {isConnecting && (
              <View style={estilosConexao.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={estilosConexao.loadingText}>Conectando...</Text>
              </View>
            )}
          </>
        )}

        {/*Tela após conectado*/}
        {selectedDevice && isConnected && (
          <>
            {/*Dispositivo conectado e botão para desconectar*/}
            <View style={[estilosConectado.containerBotaoDesconectar]}>
              <TouchableOpacity
                onPress={() => disconnect()} style={[estilosConectado.botaoDesconectar]}>
                <Text style={estilosConectado.textoBotaoDesconectar}>Desconectar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={tratarAtualizacaoDeInformacao} style={[estilosConectado.botaoAtualizar]}>
                <Image source={require('./assets/images/atualizar.png')} style={estilosConectado.iconeAtualizar} />
              </TouchableOpacity>
            </View>

            {/*Lista de opções de Porcentagem e Tempo*/}
            <View style={estilosConectado.containerMaquina}>
              <View style={estilosConectado.blocosLateraisMaquina}>
                <Text style={estilosConectado.geracaoEtempo}>Geração</Text>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoPorcentagem(4); enviarComandoParaArduino(`nivel:4,tempo:${selecionarOpcaoTempo},estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.textoCadaOpcao}>100%</Text>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoPorcentagem === 4 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoPorcentagem(3); enviarComandoParaArduino(`nivel:3,tempo:${selecionarOpcaoTempo},estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.textoCadaOpcao}>75%</Text>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoPorcentagem === 3 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoPorcentagem(2); enviarComandoParaArduino(`nivel:2,tempo:${selecionarOpcaoTempo},estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.textoCadaOpcao}>50%</Text>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoPorcentagem === 2 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoPorcentagem(1); enviarComandoParaArduino(`nivel:1,tempo:${selecionarOpcaoTempo},estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.textoCadaOpcao}>25%</Text>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoPorcentagem === 1 ? '🟢' : '⚪'}</Text>
                  </View>
                </TouchableOpacity>

                {/*Botão +*/}
                <TouchableOpacity style={estilosConectado.botaoMais} onPress={aumentarGeracao}>
                  <Text style={estilosConectado.textoBotaoMais}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={estilosConectado.blocosLateraisMaquina}>
                <Text style={estilosConectado.geracaoEtempo}>Tempo</Text>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoTempo(4); enviarComandoParaArduino(`nivel:${selecionarOpcaoPorcentagem},tempo:4,estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoTempo === 4 ? '🟢' : '⚪'}</Text>
                    <Text style={estilosConectado.textoCadaOpcao}>Direto</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoTempo(3); enviarComandoParaArduino(`nivel:${selecionarOpcaoPorcentagem},tempo:3,estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoTempo === 3 ? '🟢' : '⚪'}</Text>
                    <Text style={estilosConectado.textoCadaOpcao}>10h</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoTempo(2); enviarComandoParaArduino(`nivel:${selecionarOpcaoPorcentagem},tempo:2,estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoTempo === 2 ? '🟢' : '⚪'}</Text>
                    <Text style={estilosConectado.textoCadaOpcao}>4h</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilosConectado.cadaOpcaoMaquina}
                  onPress={() => { setSelecionarOpcaoTempo(1); enviarComandoParaArduino(`nivel:${selecionarOpcaoPorcentagem},tempo:1,estado:${estado}`); }}>
                  <View style={[estilosConectado.opcaoEled]}>
                    <Text style={estilosConectado.botaoBrancoVerde}>{selecionarOpcaoTempo === 1 ? '🟢' : '⚪'}</Text>
                    <Text style={estilosConectado.textoCadaOpcao}>2h</Text>
                  </View>
                </TouchableOpacity>

                {/*Botão +*/}
                <TouchableOpacity style={estilosConectado.botaoMais} onPress={aumentarTempo}>
                  <Text style={estilosConectado.textoBotaoMais}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={estilosConectado.informacoesSelecionadas}>
              {selecionarOpcaoTempo && (
                <Image source={obterImagem()} style={estilosConectado.imagens}
                />
              )}
              {selecionarOpcaoTempo && (
                <View style={estilosConectado.containerContador}>
                  <Text style={estilosConectado.textoContador}>
                    {selecionarOpcaoTempo === 4
                      ? formatarTempo(selecionarTempoOperacao)
                      : formatarTempo(selecionarTempoRestante)}
                  </Text>
                </View>
              )}
            </View>

            <View style={estilosConectado.switchContainer}>
              <Text style={estilosConectado.textoSwitch}>{isSwitchOn ? 'Desligar' : 'Ligar'}</Text>
              <Switch
                value={isSwitchOn}
                onValueChange={handleSwitchChange}
                trackColor={{ false: "#FF6B6B", true: "#4CAF50" }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // Aumenta o tamanho do Switch
              />
            </View>

            <View style={estilosMensagens.messageContainer}>
              <View style={estilosMensagens.header}>
                <TouchableOpacity onPress={clearMessages} style={estilosMensagens.botaoLimpar}>
                  <Text style={estilosMensagens.textoBotaoLimpar}>Limpar</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={estilosMensagens.scrollView}>
                {mensagensRecebidas.map((msg, index) => (
                  <Text key={index} style={estilosMensagens.textoMensagens}>{msg}</Text>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );

};

export default BluetoothClassicTerminal;
