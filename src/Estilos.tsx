import { StyleSheet } from "react-native";

export const estilosConectado = StyleSheet.create({
    botaoDesconectar: {
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },

    textoBotaoDesconectar: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: 18,
        color: '#FFFFFF',
    },

    containerBotaoDesconectar: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row', // Mudança para colocar os botões na mesma linha
        justifyContent: 'space-between', // Mudança para espaçar os botões igualmente
    },

    botaoAtualizar: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
        marginLeft: 10, // Espaço entre os botões
    },

    iconeAtualizar: {
        width: 24,
        height: 24,
    },

    textoBotaoAtualizar: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: 18,
        color: '#FFFFFF',
    },

    containerMaquina: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },

    blocosLateraisMaquina: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10,
        height: 'auto',
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 5,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: 175,
    },

    geracaoEtempo: {
        fontSize: 28,
        color: '#292929',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 5,
    },

    opcaoEled: {
        width: 150,
        borderWidth: 0.5,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
    },

    cadaOpcaoMaquina: {
        alignItems: 'center',
        marginBottom: 2,
    },

    textoCadaOpcao: {
        fontFamily: 'Montserrat-Bold',
        color: '#292929',
        fontSize: 20,
    },

    botaoBrancoVerde: {
        fontSize: 25,
    },

    textoBotaoMais: {
        fontFamily: 'Montserrat-Bold',
        color: '#FFFFFF',
        fontSize: 30,
        textAlign: 'center',
    },

    botaoMais: {
        borderWidth: 0.5,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 7,
        borderRadius: 25,
        backgroundColor: '#292929',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },

    botaoLigar: {
        width: 150,
        height: 50,
        borderWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },

    textoBotaoLigar: {
        fontFamily: 'Montserrat-Bold',
        color: '#FFFFFF',
        fontSize: 20,
    },

    informacoesSelecionadas: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 30,
        marginVertical: 10,
    },

    imagens: {
        width: 100,
        height: 100,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },

    containerContador: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },

    textoContador: {
        fontSize: 24,
        fontFamily: 'Orbitron-Medium',
        color: '#292929',
    },

    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },

    textoSwitch: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        marginRight: 10,
    },
});

export const estilosConexao = StyleSheet.create({
    containerGeral: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        padding: 20,
    },

    containerTelaConexao: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    tituloAplicativo: {
        fontSize: 36,
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        color: '#292929',
        marginBottom: 20,
        marginTop: 15,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderColor: '#e0e0e0',
    },

    botaoAtualizaLista: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },

    textoBotaoScan: {
        color: '#292929',
        fontSize: 15,
        fontFamily: 'Montserrat-Bold',
    },

    botaoAtualizarLista: {
        color: '#292929',
        fontSize: 25,
        fontFamily: 'Montserrat-Bold',
    },

    tituloListaDispositivos: {
        color: '#292929',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 20,
    },

    containerListaDispositivos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: '#d0d0d0',
        padding: 10,
        alignItems: 'center',
        width: 350,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },

    nomeDispositivoLista: {
        fontSize: 16,
        color: '#292929',
        fontFamily: 'Montserrat-Bold'
    },

    dispositivoId: {
        fontSize: 12,
        fontFamily: 'Montserrat-Light',
        color: '#292929',
    },

    textoBotaoConectar: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: 18,
        color: '#4CAF50',
    },

    botaoConectar: {
        alignItems: 'center',
    },
    
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#000',
      },
});

export const estilosMensagens = StyleSheet.create({
    messageContainer: {
        marginTop: 20,
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        height: 150, // Altura fixa do container
    },

    scrollView: {
        flex: 1,
    },

    textoMensagens: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#292929',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    botaoLimpar: {
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },

    textoBotaoLimpar: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#292929',
    },
});