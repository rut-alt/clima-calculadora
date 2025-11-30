let currentStep = 1;
let answers = {};

function saveAnswer(key, value) {
    answers[key] = value;
}

function nextStep() {
    document.querySelector(`[data-step="${currentStep}"]`).classList.remove("active");
    currentStep++;
    document.querySelector(`[data-step="${currentStep}"]`).classList.add("active");

    let progress = ((currentStep - 1) / 6) * 100;
    document.getElementById("calc-progress-bar").style.width = progress + "%";

    if (currentStep === 7) generateResult();
}

/* === LÓGICA DE EJEMPLO === */
function generateResult() {

    let tipo = answers.tipo;
    let metros = parseInt(answers.metros);
    let calidad = answers.calidad;

    let potencia = (metros <= 25) ? "2.5 kW" :
                   (metros <= 40) ? "3.5 kW" :
                   (metros <= 60) ? "5.0 kW" :
                   "2 equipos recomendados";

    let equipo = "Equipo no definido";

    if (tipo === "split") {
        if (calidad === "economico") equipo = "Midea Basic " + potencia;
        if (calidad === "medio") equipo = "Hisense Comfort " + potencia;
        if (calidad === "premium") equipo = "Daikin Sensira " + potencia;
    }

    if (tipo === "conductos") equipo = "Conductos Mitsubishi 7.1 kW";
    if (tipo === "aerotermia") equipo = "Aerotermia Panasonic Aquarea 6 kW";
    if (tipo === "completa") equipo = "Sistema completo Daikin Altherma";

    let resultado = `
        <h3>💨 Recomendación</h3>
        <p class="result-item"><strong>Equipo recomendado:</strong> ${equipo}</p>
        <p class="result-item"><strong>Potencia ideal:</strong> ${potencia}</p>
        <p class="result-item"><strong>Instalación:</strong> ${answers.dificultad}</p>
        <p class="result-item"><strong>Preinstalación:</strong> ${answers.preinstal}</p>
        <p class="result-item"><strong>WiFi:</strong> ${answers.wifi}</p>
        <p class="result-item"><strong>Precio orientativo:</strong> 650€ – 1200€</p>
    `;

    document.getElementById("result-content").innerHTML = resultado;
}

