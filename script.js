const displayBateria = document.getElementById('display-bateria');
const barraBateria = document.getElementById('barra-bateria');
const displayTemperatura = document.getElementById('display-temperatura');
const displayStatus = document.getElementById('display-status');
const caixaAlertas = document.getElementById('caixa-alertas');

const labelBateria = document.getElementById('label-bateria');
const labelTemperatura = document.getElementById('label-temperatura');
const labelSolar = document.getElementById('label-solar');

const inputBateria = document.getElementById('input-bateria');
const inputTemperatura = document.getElementById('input-temperatura');
const inputSolar = document.getElementById('input-solar');

const btnMotor = document.getElementById('btn-motor');

let tempBat = 1500;

let timerEstabilizacao;
let timerEspera;
let timerGeracao;
let timerEsperaSolar;
let timerMotor;

let alertaBateriaAtivo = false;
let alertaTempAlta = false;
let alertaTempBaixa = false;
let alertaEstavel = true;
let alertaMotor = false;

let modoEconomia = false;
let motorLigado = false;
let podeLigar = true;
let sistemaEmPerigo = false;

function analisarSistema() {
    let nivelBateria = parseInt(inputBateria.value);
    let tempExterna = parseInt(inputTemperatura.value);
    let geracaoSolar = parseInt(inputSolar.value);

    labelBateria.textContent = `Nível de Bateria ${nivelBateria}(%)`;
    labelTemperatura.textContent = `Temperatura Externa ${tempExterna}(°C)`;
    labelSolar.textContent = `Geração Solar ${geracaoSolar}(%)`;
    
    displayBateria.textContent = nivelBateria + "%";
    barraBateria.style.width = nivelBateria + "%";
    displayTemperatura.textContent = tempExterna + "°C";

    // Energia
    if (nivelBateria <= 20) {
        barraBateria.style.backgroundColor = "#da3633"; 
        displayStatus.textContent = "MODO ECONOMIA";
        displayStatus.style.color = "#d29922"; 
        sistemaEmPerigo = true;
        if (!modoEconomia) {
            modoEconomia = true;
            tempBat = 3000;
            reiniciarMotor();
        }
        if (!alertaBateriaAtivo) {
            registrarAlerta("ALERTA: Bateria crítica. Desativando módulos não essenciais.");
            alertaBateriaAtivo = true;
        }
    } else {
        barraBateria.style.backgroundColor = "#2ea043"; 
        displayStatus.textContent = "ONLINE";
        displayStatus.style.color = "#2ea043";
        sistemaEmPerigo = false;
        alertaBateriaAtivo = false;
        if (modoEconomia) {
            modoEconomia = false;
            tempBat = 1500;
            reiniciarMotor();
        }
    }

    // Temperatura
    if (tempExterna > 80) {
        displayTemperatura.style.color = "#da3633";
        sistemaEmPerigo = true;

        if (!alertaTempAlta) {
            registrarAlerta("ALERTA: Superaquecimento detetado no casco externo!");
            alertaTempAlta = true;
        }
        alertaTempBaixa = false;

    } else if (tempExterna < -100) {
        displayTemperatura.style.color = "#58a6ff";
        sistemaEmPerigo = true;
        if (!alertaTempBaixa) {
            registrarAlerta("ALERTA: Temperatura extremamente baixa.");
            alertaTempBaixa = true;
        }
        alertaTempAlta = false;

    } else {
        displayTemperatura.style.color = "#c9d1d9";
        sistemaEmPerigo = false;
        alertaTempAlta = false;
        alertaTempBaixa = false;
    }


    const containerNave = document.querySelector('.container');

    if (motorLigado && nivelBateria > 0) {
        btnMotor.textContent = "Desligar Motores";
        btnMotor.style.backgroundColor = "#d29922";
        containerNave.classList.add('nave-tremendo');
        if (!alertaMotor) {
            registrarAlerta("SISTEMA: Motores acionados.");
            alertaMotor = true;
        }
    } else {
        btnMotor.textContent = "Ligar Motores de Propulsão";
        btnMotor.style.backgroundColor = "#da3633";
        containerNave.classList.remove('nave-tremendo');
        if (nivelBateria <= 0 && motorLigado) {
            registrarAlerta("ALERTA: Sem bateria. Desligando motores...")
        }
    }
}

function registrarAlerta(mensagem) {
    const novoAlerta = document.createElement('p');
    novoAlerta.textContent = `> ${mensagem}`;
    
    caixaAlertas.appendChild(novoAlerta);

    if (caixaAlertas.children.length > 4) {
        caixaAlertas.removeChild(caixaAlertas.firstElementChild);
    }
}

function iniciarEstabilizacao() {
    let tempAtual = parseInt(inputTemperatura.value);

    clearTimeout(timerEspera);
    clearInterval(timerEstabilizacao);

    //Temperatura
    if (tempAtual > 80 || tempAtual < -100) {
        timerEspera = setTimeout(() => {
            registrarAlerta("SISTEMA: Iniciando protocolo de estabilização térmica...");
            
            timerEstabilizacao = setInterval(() => {
                let temp = parseInt(inputTemperatura.value);
                let bateria = parseInt(inputBateria.value);

                if (bateria <= 0) {
                    clearInterval(timerEstabilizacao);
                    registrarAlerta("FALHA CRÍTICA: Energia esgotada. O suporte térmico falhou!");
                    return; 
                }

                if (temp > 80) {
                    temp--;
                } else if (temp < -100) {
                    temp++;
                } else {
                    clearInterval(timerEstabilizacao);
                    registrarAlerta("SISTEMA: Temperatura estabilizada.");
                    return;
                }
                
                inputTemperatura.value = temp;
                analisarSistema();
            }, 100);
        }, 3000);
    }
}

function geracaoSolar() {
    let solarAtual = parseInt(inputSolar.value);
    let tempRecarga = (1.1 - (solarAtual/100)) * 1000;
    clearTimeout(timerEsperaSolar);
    clearInterval(timerGeracao);
    if (motorLigado) {
        tempRecarga = tempRecarga*2;
    }

    if (solarAtual > 0) {
        timerEsperaSolar = setTimeout(() => {
            registrarAlerta("SISTEMA: Geração solar funcionando, carregando baterias...");

            timerGeracao = setInterval(() => {
                let bateria = parseInt(inputBateria.value);
                if (bateria < 100) {
                    bateria ++;
                } else {
                    clearInterval(timerGeracao);
                    registrarAlerta("SISTEMA: Bateria carregada.");
                    return;
                }
                inputBateria.value = bateria;
                analisarSistema();

            }, tempRecarga);
        },3000);
    }
}

function motor() {
    if (timerMotor) return;

    timerMotor = setInterval(() => {
        if (motorLigado) {
            let bateria = parseInt(inputBateria.value);
            if (bateria > 0) {
                bateria --;
            } else {
                clearInterval(timerMotor);
                timerMotor = null;
                return;
            }
            inputBateria.value = bateria;
            analisarSistema();
            
            if (bateria === 99) {
                geracaoSolar();
            }
        }
    },tempBat);
}

function reiniciarMotor() {
    clearInterval(timerMotor);
    timerMotor = null;
    if (motorLigado) {
        motor();
    }
}

// ouvinte temperatura
inputTemperatura.addEventListener('input', () => {
    analisarSistema();
    iniciarEstabilizacao();
});

// ouvinte bateria
inputBateria.addEventListener('input', () => {
    analisarSistema();
    geracaoSolar();
});

// ouvinte solar
inputSolar.addEventListener('input', () => {
    analisarSistema();
    geracaoSolar();
});

// ouvinte motor
btnMotor.addEventListener('click', () => {
    motorLigado = !motorLigado;

    if (motorLigado) {
        motor();
    } else {
        registrarAlerta("SISTEMA: Motores desligados. Entrando em órbita estacionária.");
        clearInterval(timerMotor);
        timerMotor = null;
    }
    analisarSistema();
    geracaoSolar();
});