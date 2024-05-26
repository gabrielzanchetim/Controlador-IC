import { StyleSheet } from "react-native";

export const stylesConexao = StyleSheet.create({
    containerGeral: {
        backgroundColor: '#f5f5f5', // Define a cor de fundo do aplicativo
        flex: 1, // Faz com que a View ocupe todo o espaço disponível
        padding: 10,
    },

    containerTelaConexao: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    tituloAplicativo: {
        fontSize: 40,
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        color: '#292929',
        marginBottom: 5,
        marginTop: 15,
        paddingBottom: 40,
        borderBottomWidth: 2,
    },

    botaoAtualizaLista: {
        marginTop: 40,
        marginBottom: 40,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 4,
        borderRadius: 5,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 150,
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
        marginBottom: 4,
        borderWidth: 0.5,
        padding: 5,
        alignItems: 'center',
        width: 350,
        borderRadius: 5,
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
        color: '#8FBC8F'
    },

    botaoConectar: {
        alignItems: 'center',
    }
});