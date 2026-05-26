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
const btnFalha = document.getElementById('btn-falha');

let timerEstabilizacao;
let timerEspera;
let timerGeracao;
let timerEsperaSolar;
let timerMotor;

let motorLigado = false;
let sistemaEmPerigo = false;
let energiaOK = true;
let tempOK = true;
let gerando = false;

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
        energiaOK = false;
        sistemaEmPerigo = true;
        if (!gerando) {
            registrarAlerta("ALERTA: Bateria crítica. Desativando módulos não essenciais.");
        }
    } else {
        barraBateria.style.backgroundColor = "#2ea043"; 
        displayStatus.textContent = "ONLINE";
        displayStatus.style.color = "#2ea043";
        energiaOK = true;
    }

    // Temperatura
    if (tempExterna > 80) {
        displayTemperatura.style.color = "#da3633";
        tempOK = false;
        sistemaEmPerigo = true;
        registrarAlerta("PERIGO: Superaquecimento detectado no casco externo!");
    } else if (tempExterna < -100) {
        displayTemperatura.style.color = "#58a6ff";
        tempOK = false;
        sistemaEmPerigo = true;
        registrarAlerta("AVISO: Temperatura extremamente baixa.");
    } else {
        displayTemperatura.style.color = "#c9d1d9";
        tempOK = true;
    }

    if (energiaOK && tempOK && sistemaEmPerigo) {
        registrarAlerta("SISTEMA: Sistema estável.");
        sistemaEmPerigo = false;
    } 
}

// Alerta
function registrarAlerta(mensagem) {
    const novoAlerta = document.createElement('p');
    novoAlerta.textContent = `> ${mensagem}`;
    caixaAlertas.innerHTML = ""; 
    caixaAlertas.appendChild(novoAlerta);
}

// 2. FUNÇÃO QUE GERENCIA O TEMPO E A MATEMÁTICA
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
            gerando = true;
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
    gerando = false;
}

function motor() {
    clearInterval(timerMotor);

    timerMotor = setInterval(() => {
        let geracaoSolar = parseInt(inputSolar.value);
        if (motorLigado) {
            let bateria = parseInt(inputBateria.value);
            if (bateria > 0) {
                bateria --;
            } else {
                clearInterval(timerMotor);
                return;
            }
            inputBateria.value = bateria;
            analisarSistema();
        }
    },1500)
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


btnMotor.addEventListener('click', () => {
    motorLigado = !motorLigado; 
    const containerNave = document.querySelector('.container');

    if (motorLigado) {
        motor();
        btnMotor.textContent = "Desligar Motores";
        btnMotor.style.backgroundColor = "#d29922"; // Fica amarelo aviso
        containerNave.classList.add('nave-tremendo'); // Liga o tremor
        registrarAlerta("NAVEGAÇÃO: Motores acionados. Consumo de energia crítico!");
    } else {
        btnMotor.textContent = "Ligar Motores de Propulsão";
        btnMotor.style.backgroundColor = "#da3633"; // Volta ao vermelho botão normal
        containerNave.classList.remove('nave-tremendo'); // Desliga o tremor
        registrarAlerta("NAVEGAÇÃO: Motores desligados. Entrando em órbita estacionária.");
    }
    geracaoSolar();
});

btnFalha.addEventListener('click', () => {
    inputBateria.value = 5;
    inputTemperatura.value = 120;
    
    analisarSistema(); 
    iniciarEstabilizacao();
    geracaoSolar();
    
    registrarAlerta("FALHA CRÍTICA SIMULADA PELO USUÁRIO.");
});