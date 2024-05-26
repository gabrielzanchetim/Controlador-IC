import { StyleSheet } from "react-native";

export const stylesConectado = StyleSheet.create({
    botaoDesconectar: {
        alignItems: 'center',
        backgroundColor: '#CF8F8F',
        borderRadius: 5,
    },

    textoBotaoDesconectar: {
        fontFamily: 'Montserrat-ExtraBold',
        fontSize: 18,
        color: '#292929',
        padding: 5
    },

    containerBotaoDesconectar: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'flex-start'
    },

    containerMaquina: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    blocosLateraisMaquina: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center', // Centraliza os itens verticalmente
        marginVertical: 5,
        height: 355,
        borderWidth: 0.5,
        width: 180
    },

    geracaoEtempo: {
        fontSize: 34,
        color: '#292929',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 10,
    },

    opcaoEled: {
        width: 150,
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },

    cadaOpcaoMaquina: {
        alignItems: 'center',
        marginBottom: 5,
    },

    textoCadaOpcao: {
        fontFamily: 'Montserrat-Bold',
        color: '#292929',
        fontSize: 25,
    },

    botaoBrancoVerde: {
        fontSize: 30,
    },

    textoBotaoMais: {
        fontFamily: 'Montserrat-Bold',
        color: '#292929',
        fontSize: 30,
        textAlign: 'center',
    },

    botaoMais: {
        borderWidth: 0.5,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 50,
    },

    botaoLigar: {
        width: 150,
        height: 41.5,
        borderWidth: 0.5,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textoBotaoLigar: {
        fontFamily: 'Montserrat-Bold',
        color: '#292929',
        fontSize: 25,
    },

    informacoesSelecionadas: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginVertical: 10,
    },

    imagens: {
        width: 100,
        height: 100,
    },

    containerContador: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 100,
    },

    textoContador: {
        fontSize: 30,
        fontFamily: 'Montserrat-Bold',
        color: '#292929',
    }
});