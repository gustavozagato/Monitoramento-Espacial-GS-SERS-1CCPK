# Simulador de Gestão Energética Espacial 🛰️
**Global Solution 2026.1 - Soluções em Energias Renováveis e Sustentabilidade**

## Equipe
* Gustavo Zagato Bottechia - RM: 569420
* Davi Q. Zuolo - RM: 571669
* Daniel Vilela Mana - RM: 571632

## O Problema
Em missões espaciais, a sobrevivência depende de um balanço energético rigoroso e do controlo térmico contra as variações extremas do vácuo (-150°C a 150°C). O problema central é a ausência de intervenção humana em tempo real: o sistema deve ser capaz de gerir a captação de energia renovável (solar), calcular o consumo dinâmico dos propulsores e tomar decisões automatizadas para evitar o colapso estrutural por superaquecimento ou a falha total de energia (blackout).

## A Solução e Impacto Sustentável
Desenvolvemos uma interface de simulação web baseada em um motor físico construído em JavaScript. O sistema aplica os princípios de eficiência energética da seguinte forma:
* **Balanço Energético em Tempo Real:** O sistema calcula a diferença entre a geração solar instantânea e a demanda de consumo da nave (que sofre picos drásticos ao acionar os motores).
* **Gestão de Crise (Modo Economia):** Ao atingir 20% de bateria, a Inteligência Artificial introdutória do sistema corta os módulos não essenciais, reduzindo o consumo passivo.
* **Estabilização Térmica Ativa:** Simulamos o Subsistema de Controlo Térmico (TCS). Se a temperatura atingir níveis críticos, o sistema aciona algoritmos de estabilização para reverter o quadro grau a grau, alertando a tripulação através de um terminal de logs seguro.

## Tecnologias e Engenharia Utilizadas
A arquitetura foi desenvolvida 100% no lado do cliente (Client-side), sem dependências de frameworks externos:
* **HTML5 & CSS3:** Interface dividida com `Flexbox`, garantindo a separação entre o painel de exibição (dados) e o painel de controlo (inputs do utilizador). Uso de `@keyframes` para feedback visual dinâmico (vibração dos motores).
* **Vanilla JavaScript:**
  * Manipulação de DOM e injeção de HTML dinâmico para o terminal de logs.
  * Gestão de concorrência com **Máquinas de Estado (Flags)** (`estabilizando`, `motorLigado`, `sistemaEmPerigo`) para evitar conflitos na lógica de sobreposição.
  * Motor de simulação temporal utilizando processamento assíncrono (`setInterval` e `setTimeout`) para calcular a geração, o consumo e o decaimento térmico de forma simultânea e independente.

## Como Executar o Projeto
Existem dois métodos para ver o projeto:
### Localmente
1. Faça o clone deste repositório.
2. Não é necessária a instalação de nenhum servidor ou interpretador.
3. Abra o ficheiro `index.html` em qualquer navegador.
### Nuvem
Entre no link dentro do arquivo .txt ou clique em: https://github.com/gustavozagato/Monitoramento-Espacial-GS-SERS-1CCPK
