// INCLUSÃO DE BIBLIOTECAS
#include <SoftwareSerial.h>
#include <string.h>
#include <EEPROM.h>

// DEFINIÇÃO DE PIN 0 (RX) E PIN 1 (TX)
SoftwareSerial bluetooth(0, 1); // RX (pin 0), TX (pin 1)

// LEDS NIVEL (esquerda)
const int L_NIVEL4 = 2;
const int L_NIVEL3 = 3;
const int L_NIVEL2 = 4;
const int L_NIVEL1 = 5;

// LEDS TEMPO (direita)
const int L_TEMPO4 = 6;
const int L_TEMPO3 = 7;
const int L_TEMPO2 = 8;
const int L_TEMPO1 = 9;

// LED ON
const int L_ON = 13;

// BOTÕES
const int botaoGeracao = 10; // Botão que comanda Geração (Esquerda)
const int botaoTempo = 11;   // Botão que comanda Tempo (Direita)
const int botaoIniciar = 12; // Novo botão que comanda Iniciar (Novo)

// VARÍAVEIS PARA LEITURAS DE CLICKS
int clickbotaoGeracao = 0;
int clickbotaoTempo = 0;
int clickbotaoIniciar = 0;

// VARIÁVEIS DE CONTROLES DE ESTADO
int estado;
int nivel;
int tempo;
int operando;

// VARIÁVEIS DE CONTROLES DE TEMPO
int tempoPassado;
int auxiliarTempo;

// VARIÁVEIS DE TEMPO (millis)
unsigned long msAnteriores = 0;
unsigned long ledMsAnteriores = 0;
const long intervalo_500ms = 500;
const long intervalo_10s = 10001; // 10 segundos
const long intervalo_4s = 4001;   // 4 segundos
const long intervalo_2s = 2001;   // 2 segundos

void ligaLed(int led)
{
    digitalWrite(led, HIGH);
}

void desligaLed(int led)
{
    digitalWrite(led, LOW);
}

void imprimeInfo()
{
    Serial.print("nivel:");
    Serial.print(nivel);
    Serial.print(",");
    Serial.print("tempo:");
    Serial.print(tempo);
    Serial.print(",");
    Serial.print("estado:");
    Serial.println(estado);
}

// Função para enviar uma mensagem via Bluetooth
void enviarMensagem(String mensagem) {
    Serial.println(mensagem);
}

void zerarVariaveis(int auxiliarTempo, int tempoPassado, int estado) {
    auxiliarTempo = 0;
    tempoPassado = 0;
    digitalWrite(L_ON, HIGH); // Mantém o LED L_ON aceso
    EEPROM.write(3, 0);
    EEPROM.write(0, 0);
    delay(1000);
    estado = 2; // Volta para o estado 2
}

void setup()
{
    bluetooth.begin(9600); // Inicializa a comunicação serial com o módulo Bluetooth
    Serial.begin(9600);    // Inicializa a comunicação serial para depuração

    // Configura os pinos dos LEDs como saída
    pinMode(L_NIVEL4, OUTPUT);
    pinMode(L_NIVEL3, OUTPUT);
    pinMode(L_NIVEL2, OUTPUT);
    pinMode(L_NIVEL1, OUTPUT);

    pinMode(L_TEMPO4, OUTPUT);
    pinMode(L_TEMPO3, OUTPUT);
    pinMode(L_TEMPO2, OUTPUT);
    pinMode(L_TEMPO1, OUTPUT);

    pinMode(L_ON, OUTPUT);

    pinMode(botaoGeracao, INPUT);
    pinMode(botaoTempo, INPUT);
    pinMode(botaoIniciar, INPUT);

    estado = 1;
    nivel = 1;
    tempo = 1;
    tempoPassado = 0;
    auxiliarTempo = 0;

    digitalWrite(L_ON, HIGH); // Mantém o LED L_ON aceso por padrão
}

void loop()
{
    unsigned long msAtuais = millis();

    switch (estado)
    {
        case 1:
          // LEITURA EEPROM (1) = NIVEL | (2) TEMPO
          operando = EEPROM.read(0);
          nivel = EEPROM.read(1);
          tempo = EEPROM.read(2);
          tempoPassado = EEPROM.read(3);
          auxiliarTempo = EEPROM.read(3);
          estado = 3;
        // ESTADO REPOUSO
        case 2:
            imprimeInfo();
            while (estado == 2)
            {
                clickbotaoGeracao = digitalRead(botaoGeracao);
                clickbotaoTempo = digitalRead(botaoTempo);
                clickbotaoIniciar = digitalRead(botaoIniciar);

                if (clickbotaoGeracao == HIGH)
                {
                    estado = 3;
                    nivel++;
                    delay(500);
                }
                if (clickbotaoTempo == HIGH)
                {
                    estado = 4;
                    tempo++;
                    delay(500);
                }
                if (clickbotaoIniciar == HIGH)
                {
                    estado = 5;
                    delay(500);
                }

                if (bluetooth.available() > 0)
                {                                                            // Verifica se há dados disponíveis para leitura
                    String stringRecebida = bluetooth.readStringUntil('\n'); // Lê a string recebida até o caractere de nova linha '\n'
                    String info = "INFO";

                    if (stringRecebida.equals(info))
                    {
                        imprimeInfo();
                    }
                    else
                    {
                        // Split da string
                        int indicePrimeiraVirgula = stringRecebida.indexOf(',');                       // Encontra o índice da primeira vírgula na string
                        int indiceSegundaVirgula = stringRecebida.indexOf(',', indicePrimeiraVirgula + 1); // Encontra o índice da segunda vírgula na string

                        if (indicePrimeiraVirgula != -1 && indiceSegundaVirgula != -1)
                        {
                            String valor1String = stringRecebida.substring(6, indicePrimeiraVirgula);                    // Extrai a parte após 'nivel:'
                            String valor2String = stringRecebida.substring(indicePrimeiraVirgula + 7, indiceSegundaVirgula); // Extrai a parte após 'tempo:'
                            String valor3String = stringRecebida.substring(indiceSegundaVirgula + 8);                  // Extrai a parte após 'estado:'

                            // Converte as strings para inteiros
                            int novoNivel = valor1String.toInt();
                            int novoTempo = valor2String.toInt();
                            int novoEstado = valor3String.toInt();

                            if (nivel != novoNivel)
                            {
                                nivel = novoNivel;
                                estado = 3;
                                delay(500);
                            }
                            else if (tempo != novoTempo)
                            {
                                tempo = novoTempo;
                                estado = 3;
                                delay(500);
                            }
                            else if (estado != novoEstado)
                            {
                                estado = novoEstado;
                                delay(500);
                            }
                        }
                    }
                }
            }
            break;

        // ESTADO GERACAO
        case 3:
            if (nivel > 4)
            {
                nivel = 1;
            }
            switch (nivel)
            {
                case 1:
                    ligaLed(L_TEMPO1);
                    desligaLed(L_TEMPO2);
                    desligaLed(L_TEMPO3);
                    desligaLed(L_TEMPO4);
                    EEPROM.write(1, nivel);
                    break;

                case 2:
                    desligaLed(L_TEMPO1);
                    ligaLed(L_TEMPO2);
                    desligaLed(L_TEMPO3);
                    desligaLed(L_TEMPO4);
                    EEPROM.write(1, nivel);
                    break;

                case 3:
                    desligaLed(L_TEMPO1);
                    desligaLed(L_TEMPO2);
                    ligaLed(L_TEMPO3);
                    desligaLed(L_TEMPO4);
                    EEPROM.write(1, nivel);
                    break;

                case 4:
                    desligaLed(L_TEMPO1);
                    desligaLed(L_TEMPO2);
                    desligaLed(L_TEMPO3);
                    EEPROM.write(1, nivel);
                    ligaLed(L_TEMPO4);
                    break;
            }
            estado = 4;
            break;

        // ESTADO TEMPO
        case 4:
            if (tempo > 4)
            {
                tempo = 1;
            }
            switch (tempo)
            {
                case 1:
                    ligaLed(L_NIVEL1);
                    desligaLed(L_NIVEL2);
                    desligaLed(L_NIVEL3);
                    desligaLed(L_NIVEL4);
                    EEPROM.write(2, tempo);
                    break;

                case 2:
                    desligaLed(L_NIVEL1);
                    ligaLed(L_NIVEL2);
                    desligaLed(L_NIVEL3);
                    desligaLed(L_NIVEL4);
                    EEPROM.write(2, tempo);
                    break;

                case 3:
                    desligaLed(L_NIVEL1);
                    desligaLed(L_NIVEL2);
                    ligaLed(L_NIVEL3);
                    desligaLed(L_NIVEL4);
                    EEPROM.write(2, tempo);
                    break;

                case 4:
                    desligaLed(L_NIVEL1);
                    desligaLed(L_NIVEL2);
                    desligaLed(L_NIVEL3);
                    ligaLed(L_NIVEL4);
                    EEPROM.write(2, tempo);
                    break;
            }
            estado = 2;
            if (EEPROM.read(0) == 1)
                estado = 5;
            break;

        // ESTADO INICIAR
        case 5:
            imprimeInfo();
            EEPROM.write(0, 1);
            unsigned long msAnteriores = millis();
            unsigned long printintervalo = 1000;

            if (tempo == 4) // Ficar ligado até que o botaoIniciar seja clicado novamente
            {
                unsigned long printMs = millis(); // Tempo da última impressão

                while (digitalRead(botaoIniciar) == LOW)
                {
                    unsigned long msAtuais = millis();
                    // Verifica se 1 segundo passou desde a última impressão
                    if (msAtuais - printMs >= printintervalo)
                    {
                        printMs = msAtuais; // Atualiza o tempo da última impressão
                        // Envia mensagem via Bluetooth
                        enviarMensagem("operando:" + String(auxiliarTempo + ((msAtuais - msAnteriores) / 1000)) + ",restante:" + String(0) + ",nivel:" + String(nivel) + ",tempo:" + String(tempo) + ",estado:" + String(estado));
                        tempoPassado++;
                        EEPROM.write(3, tempoPassado);
                    }

                    // Piscar LED L_ON a cada 1000ms
                    if (msAtuais - ledMsAnteriores >= intervalo_500ms)
                    {
                        ledMsAnteriores = msAtuais;
                        digitalWrite(L_ON, !digitalRead(L_ON)); // Alterna o estado do LED L_ON
                    }

                    // Verifica o estado do botão para encerrar o loop
                    if (digitalRead(botaoIniciar) == HIGH)
                    {
                        delay(50); // Pequeno debounce
                        if (digitalRead(botaoIniciar) == HIGH)
                        {
                            break;
                        }
                    }

                    // Pequeno atraso para evitar sobrecarregar o loop
                    delay(10);
                
                    if (bluetooth.available() > 0) {
                        String stringRecebida = bluetooth.readStringUntil('\n'); // Lê a string recebida até o caractere de nova linha
                        if (stringRecebida.equals("STOP")) {
                            zerarVariaveis(auxiliarTempo, tempoPassado, estado);
                            break;
                        }
                    }
                }
                tempoPassado++;
                EEPROM.write(3, tempoPassado);
                delay(500); // Debounce adicional ao sair do loop
            }
            else
            {
                unsigned long duracaoLedOn;

                switch (tempo) {
                    case 3:
                        duracaoLedOn = intervalo_10s - (tempoPassado * 1000);
                        break;
                    case 2:
                        duracaoLedOn = intervalo_4s - (tempoPassado * 1000);
                        break;
                    case 1:
                        duracaoLedOn = intervalo_2s - (tempoPassado * 1000);
                        break;
                }

                unsigned long msInicial = millis();
                unsigned long ultimoPrintMs = msInicial;
                unsigned long ultimoMsVerificado = msInicial;

                while (millis() - msInicial < duracaoLedOn)
                {
                    unsigned long msAtuais = millis();
                    // Envia mensagem via Bluetooth a cada segundo
                    if (msAtuais - ultimoPrintMs >= printintervalo)
                    {
                        ultimoPrintMs = msAtuais;
                        enviarMensagem("operando:" + String(auxiliarTempo + ((msAtuais - msInicial) / 1000)) + ",restante:" + String((duracaoLedOn - (msAtuais - msInicial)) / 1000) + ",nivel:" + String(nivel) + ",tempo:" + String(tempo) + ",estado:" + String(estado));
                        tempoPassado++;
                        EEPROM.write(3, tempoPassado);
                    }

                    // Piscar LED L_ON a cada 1000ms
                    if (msAtuais - ledMsAnteriores >= intervalo_500ms)
                    {
                        ledMsAnteriores = msAtuais;
                        digitalWrite(L_ON, !digitalRead(L_ON)); // Alterna o estado do LED L_ON
                    }

                    // Verifica o estado do botão a cada 10 ms
                    if (msAtuais - ultimoMsVerificado >= 10)
                    {
                        ultimoMsVerificado = msAtuais;
                        if (digitalRead(botaoIniciar) == HIGH)
                        {
                            delay(50); // Pequeno debounce
                            if (digitalRead(botaoIniciar) == HIGH)
                            {
                                break;
                            }
                        }
                    }
                    if (bluetooth.available() > 0) {
                        String stringRecebida = bluetooth.readStringUntil('\n'); // Lê a string recebida até o caractere de nova linha
                        if (stringRecebida.equals("STOP")) {
                            zerarVariaveis(auxiliarTempo, tempoPassado, estado);
                            break;
                        }
                    }
                }
            }

            // Reinicia variáveis necessárias antes de voltar para o estado 2
            auxiliarTempo = 0;
            tempoPassado = 0;
            digitalWrite(L_ON, HIGH); // Mantém o LED L_ON aceso
            EEPROM.write(3, 0);
            EEPROM.write(0, 0);
            delay(1000);
            estado = 2; // Volta para o estado 2
            break;
    }
}
