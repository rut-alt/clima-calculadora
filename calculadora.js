/* calculadora.js - Deluxe mockup premium SIN BREVO */
(() => {

  // ============================
  // STATE
  // ============================
  const state = {
    step: 1,
    answers: {},
    recommendation: {}
  };

  // ============================
  // PRECIOS BASE (inventados)
  // ============================
  const pricing = {
    split: { '2.5': 450, '3.5': 650, '5.0': 950, '2equipos': 1700 },
    conductos: { default: 1400 },
    aerotermia: { small: 4200, medium: 6800 },
    completa: { default: 9500 }
  };

  // ============================
  // IMÁGENES FINALES (CORREGIDAS)
  // ============================
  const images = {
    "Midea Basic 2.5 kW":
      "https://ingnexclima.com/wp-content/uploads/2025/10/split-1x1_ix75-6f75c8.webp",

    "Hisense Comfort 3.5 kW":
      "https://ingnexclima.com/wp-content/uploads/2025/04/aire-acondicionado-daikin-multisplit-2x1-sensira-3mxf52f1-1.png",

    "Daikin Sensira 3.5 kW":
      "https://ingnexclima.com/wp-content/uploads/2025/04/aire-acondicionado-daikin-multisplit-2x1-sensira-3mxf52f1-1.png",

    "Conductos Mitsubishi 7.1 kW":
      "https://ingnexclima.com/wp-content/uploads/2025/04/Picture7.png",

    "Aerotermia Panasonic Aquarea 6 kW":
      "https://ingnexclima.com/wp-content/uploads/2025/04/Picture7.png",

    "Sistema completo Daikin Altherma":
      "https://ingnexclima.com/wp-content/uploads/2025/10/split-1x1_ix75-6f75c8.webp",

    "default":
      "https://ingnexclima.com/wp-content/uploads/2025/10/split-1x1_ix75-6f75c8.webp"
  };

  // Helpers
  const el = (s) => document.querySelector(s);
  const els = (s) => Array.from(document.querySelectorAll(s));

  // Init
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setupOptions();
    setupNav();
    setupLeadForm();
    updateProgress();
  }

  // ============================
  // OPCIONES (botones)
  // ============================
  function setupOptions() {
    els(".option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const parentStep = btn.closest(".step").dataset.step;

        // quitar active del grupo
        btn.closest(".options")
          .querySelectorAll(".option-btn")
          .forEach((b) => b.classList.remove("active"));

        btn.classList.add("active");

        // activar botón next
        const nextBtn = document.querySelector(
          `.step[data-step="${parentStep}"] .btn-next`
        );
        if (nextBtn) nextBtn.disabled = false;

        // guardar respuesta
        const val = btn.dataset.value;
        switch (parentStep) {
          case "1":
            state.answers.tipo = val;
            break;
          case "2":
            state.answers.metros = val;
            break;
          case "3":
            state.answers.calidad = val;
            break;
          case "4":
            state.answers.preinstal = val;
            break;
          case "5":
            state.answers.wifi = val;
            break;
          case "6":
            state.answers.dificultad = val;
            break;
        }
      });
    });
  }

  // ============================
  // NAVEGACIÓN ENTRE PASOS
  // ============================
  function setupNav() {
    els(".btn-next").forEach((btn) =>
      btn.addEventListener("click", nextStep)
    );
    els(".btn-back").forEach((btn) =>
      btn.addEventListener("click", prevStep)
    );

    const editBtn = el("#edit-answers");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        goToStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function nextStep() {
    if (state.step >= 7) return;

    const stepEl = el(`.step[data-step="${state.step}"]`);
    const nextBtn = stepEl.querySelector(".btn-next");
    if (nextBtn && nextBtn.disabled) return;

    goToStep(state.step + 1);

    if (state.step === 7) generateResult();
  }

  function prevStep() {
    if (state.step <= 1) return;
    goToStep(state.step - 1);
  }

  function goToStep(n) {
    el(`.step[data-step="${state.step}"]`).classList.remove("active");

    state.step = n;

    el(`.step[data-step="${state.step}"]`).classList.add("active");

    updateProgress();

    els(".btn-back").forEach((b) => (b.disabled = state.step === 1));

    const nextBtn = el(`.step[data-step="${state.step}"] .btn-next`);
    if (nextBtn) {
      const chosen = el(`.step[data-step="${state.step}"] .option-btn.active`);
      nextBtn.disabled = !chosen;
    }
  }

  function updateProgress() {
    const p = Math.round(((state.step - 1) / 6) * 100);
    el("#calc-progress-bar").style.width = p + "%";
  }

  // ============================
  // GENERAR RESULTADO FINAL
  // ============================
  function generateResult() {
    const tipo = state.answers.tipo || "split";
    const metrosVal = parseInt(state.answers.metros || "40");
    const calidad = state.answers.calidad || "medio";
    const wifi = state.answers.wifi || "no";
    const preinstal = state.answers.preinstal || "no";
    const dificultad = state.answers.dificultad || "facil";

    // Calcular potencia
    let potencia = "2.5 kW";
    if (metrosVal <= 25) potencia = "2.5 kW";
    else if (metrosVal <= 40) potencia = "3.5 kW";
    else if (metrosVal <= 60) potencia = "5.0 kW";
    else potencia = "2 equipos recomendados";

    // Modelo recomendado
    let equipo = "Equipo no definido";
    if (tipo === "split") {
      if (calidad === "economico") equipo = `Midea Basic ${potencia}`;
      if (calidad === "medio") equipo = `Hisense Comfort ${potencia}`;
      if (calidad === "premium") equipo = `Daikin Sensira ${potencia}`;
    } else if (tipo === "conductos") {
      equipo = "Conductos Mitsubishi 7.1 kW";
    } else if (tipo === "aerotermia") {
      equipo = "Aerotermia Panasonic Aquarea 6 kW";
    } else if (tipo === "completa") {
      equipo = "Sistema completo Daikin Altherma";
    }

    // Precio base
    let basePrice = 800;
    if (tipo === "split") {
      if (potencia.includes("2.5")) basePrice = pricing.split["2.5"];
      else if (potencia.includes("3.5")) basePrice = pricing.split["3.5"];
      else if (potencia.includes("5.0")) basePrice = pricing.split["5.0"];
      else basePrice = pricing.split["2equipos"];
    } else if (tipo === "conductos") {
      basePrice = pricing.conductos.default;
    } else if (tipo === "aerotermia") {
      basePrice = pricing.aerotermia.small;
    } else if (tipo === "completa") {
      basePrice = pricing.completa.default;
    }

    // Modificadores instalación
    let installCost = 250;
    if (preinstal === "si") installCost -= 180;
    if (dificultad === "media") installCost += 120;
    if (dificultad === "dificil") installCost += 250;
    if (wifi === "si") basePrice += 40;

    // calidad
    let mult = 1;
    if (calidad === "economico") mult = 0.92;
    if (calidad === "premium") mult = 1.35;

    const finalPrice = Math.round(basePrice * mult + installCost);
    const minPrice = Math.round(finalPrice * 0.88);
    const maxPrice = Math.round(finalPrice * 1.18);

    // imagen final
    const imgSrc = images[equipo] || images.default;
    el("#result-image img").src = imgSrc;

    // rellenar resumen
    el("#result-details").innerHTML = `
      <div class="line"><strong>Equipo recomendado:</strong> ${equipo}</div>
      <div class="line"><strong>Potencia ideal:</strong> ${potencia}</div>
      <div class="line"><strong>Instalación:</strong> ${dificultad}</div>
      <div class="line"><strong>Preinstalación:</strong> ${preinstal}</div>
      <div class="line"><strong>WiFi:</strong> ${wifi}</div>
      <div class="line"><strong>Presupuesto orientativo:</strong> ${minPrice}€ – ${maxPrice}€</div>
    `;

    // WhatsApp CTA
    const phone = "34XXXXXXXXX"; // cambia por tu número
    const msg = encodeURIComponent(
      `Hola, vengo de la calculadora.
Equipo: ${equipo}
Potencia: ${potencia}
Presupuesto orientativo: ${minPrice}€ - ${maxPrice}€`
    );

    el("#wa-btn").href = `https://wa.me/${phone}?text=${msg}`;

    state.recommendation = { equipo, potencia, minPrice, maxPrice, imgSrc };
  }

  // ============================
  // LEAD FORM (localStorage)
  // ============================
  function setupLeadForm() {
    const form = el("#lead-form");
    if (!form) return;

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const name = el("#lead-name").value.trim();
      const phone = el("#lead-phone").value.trim();
      const email = el("#lead-email").value.trim();

      if (!name || !phone) {
        el(".lead-feedback").textContent =
          "Por favor, introduce nombre y teléfono.";
        return;
      }

      const lead = {
        name,
        phone,
        email,
        recommendation: state.recommendation,
        date: new Date().toISOString()
      };

      const leads =
        JSON.parse(localStorage.getItem("ingnex_leads")) || [];
      leads.push(lead);
      localStorage.setItem("ingnex_leads", JSON.stringify(leads));

      el(".lead-feedback").textContent =
        "Datos recibidos. Te contactaremos.";
      form.reset();
    });
  }
})();
