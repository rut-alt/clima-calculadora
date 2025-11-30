/* calculadora.js - Deluxe mockup premium SIN BREVO */
(() => {

  // state
  const state = {
    step: 1,
    answers: {},
    recommendation: {}
  };

  // price base values (inventados)
  const pricing = {
    split: { '2.5': 450, '3.5': 650, '5.0': 950, '2equipos': 1700 },
    conductos: { default: 1400 },
    aerotermia: { small: 4200, medium: 6800 },
    completa: { default: 9500 }
  };

  // placeholder mockup images
  const images = {
    'Midea Basic 2.5 kW': 'https://via.placeholder.com/520x320?text=Midea+Basic+2.5kW',
    'Hisense Comfort 3.5 kW': 'https://via.placeholder.com/520x320?text=Hisense+3.5kW',
    'Daikin Sensira 3.5 kW': 'https://via.placeholder.com/520x320?text=Daikin+Sensira+3.5kW',
    'Conductos Mitsubishi 7.1 kW': 'https://via.placeholder.com/520x320?text=Conductos+Mitsubishi',
    'Aerotermia Panasonic Aquarea 6 kW': 'https://via.placeholder.com/520x320?text=Aerotermia+Panasonic',
    'Sistema completo Daikin Altherma': 'https://via.placeholder.com/520x320?text=Daikin+Altherma',
    'default': 'https://via.placeholder.com/520x320?text=Equipo+recomendado'
  };

  // helpers
  const el = (s) => document.querySelector(s);
  const els = (s) => Array.from(document.querySelectorAll(s));

  // init
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupOptions();
    setupNav();
    setupLeadForm(); // local only, no Brevo
    updateProgress();
  }

  /* OPTION BUTTONS */
  function setupOptions() {
    els('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parentStep = btn.closest('.step').dataset.step;

        // remove active in that group
        btn.closest('.options').querySelectorAll('.option-btn')
          .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        // enable next
        const stepEl = document.querySelector(`.step[data-step="${parentStep}"]`);
        const nextBtn = stepEl.querySelector('.btn-next');
        if (nextBtn) nextBtn.disabled = false;

        // save answer
        const val = btn.dataset.value;
        switch (parentStep) {
          case '1': state.answers.tipo = val; break;
          case '2': state.answers.metros = val; break;
          case '3': state.answers.calidad = val; break;
          case '4': state.answers.preinstal = val; break;
          case '5': state.answers.wifi = val; break;
          case '6': state.answers.dificultad = val; break;
        }
      });
    });
  }

  /* NAVIGATION BUTTONS */
  function setupNav() {
    els('.btn-next').forEach(btn => btn.addEventListener('click', nextStep));
    els('.btn-back').forEach(btn => btn.addEventListener('click', prevStep));

    // Edit answers from result
    const editBtn = el('#edit-answers');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        goToStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function nextStep() {
    if (state.step >= 7) return;

    const stepEl = document.querySelector(`.step[data-step="${state.step}"]`);
    const nextBtn = stepEl.querySelector('.btn-next');

    if (nextBtn && nextBtn.disabled) return;

    goToStep(state.step + 1);

    if (state.step === 7) {
      generateResult();
    }
  }

  function prevStep() {
    if (state.step <= 1) return;
    goToStep(state.step - 1);
  }

  function goToStep(n) {
    document.querySelector(`.step[data-step="${state.step}"]`)
      .classList.remove('active');

    state.step = n;

    document.querySelector(`.step[data-step="${state.step}"]`)
      .classList.add('active');

    updateProgress();

    els('.btn-back').forEach(b => b.disabled = (state.step === 1));

    const nextBtn = document.querySelector(`.step[data-step="${state.step}"] .btn-next`);
    if (nextBtn) {
      const chosen = document.querySelector(`.step[data-step="${state.step}"] .option-btn.active`);
      nextBtn.disabled = !chosen;
    }
  }

  function updateProgress() {
    const p = Math.round(((state.step - 1) / 6) * 100);
    el('#calc-progress-bar').style.width = p + '%';
  }

  /* RESULT GENERATION */
  function generateResult() {
    const tipo = state.answers.tipo || 'split';
    const metrosVal = parseInt(state.answers.metros || '40');
    const calidad = state.answers.calidad || 'medio';
    const wifi = state.answers.wifi || 'no';
    const preinstal = state.answers.preinstal || 'no';
    const dificultad = state.answers.dificultad || 'facil';

    // potencia
    let potencia = '2.5 kW';
    if (metrosVal <= 25) potencia = '2.5 kW';
    else if (metrosVal <= 40) potencia = '3.5 kW';
    else if (metrosVal <= 60) potencia = '5.0 kW';
    else potencia = '2 equipos recomendados';

    // equipo recomendado
    let equipo = 'Equipo no definido';
    if (tipo === 'split') {
      if (calidad === 'economico') equipo = `Midea Basic ${potencia}`;
      if (calidad === 'medio') equipo = `Hisense Comfort ${potencia}`;
      if (calidad === 'premium') equipo = `Daikin Sensira ${potencia}`;
    } else if (tipo === 'conductos') {
      equipo = 'Conductos Mitsubishi 7.1 kW';
    } else if (tipo === 'aerotermia') {
      equipo = 'Aerotermia Panasonic Aquarea 6 kW';
    } else if (tipo === 'completa') {
      equipo = 'Sistema completo Daikin Altherma';
    }

    // price base
    let basePrice = 800;
    if (tipo === 'split') {
      if (potencia.includes('2.5')) basePrice = pricing.split['2.5'];
      else if (potencia.includes('3.5')) basePrice = pricing.split['3.5'];
      else if (potencia.includes('5.0')) basePrice = pricing.split['5.0'];
      else basePrice = pricing.split['2equipos'];
    } else if (tipo === 'conductos') {
      basePrice = pricing.conductos.default;
    } else if (tipo === 'aerotermia') {
      basePrice = pricing.aerotermia.small;
    } else if (tipo === 'completa') {
      basePrice = pricing.completa.default;
    }

    // installation modifiers
    let installCost = 250;
    if (preinstal === 'si') installCost -= 180;
    if (dificultad === 'media') installCost += 120;
    if (dificultad === 'dificil') installCost += 250;
    if (wifi === 'si') basePrice += 40;

    // quality multiplier
    let mult = 1;
    if (calidad === 'economico') mult = 0.92;
    if (calidad === 'premium') mult = 1.35;

    const finalPrice = Math.round((basePrice * mult) + installCost);
    const minPrice = Math.round(finalPrice * 0.88);
    const maxPrice = Math.round(finalPrice * 1.18);

    // image
    const imgSrc = images[equipo] || images.default;

    // fill DOM
    el('#result-image img').src = imgSrc;

    el('#result-details').innerHTML = `
      <div class="line"><strong>Equipo recomendado:</strong> ${equipo}</div>
      <div class="line"><strong>Potencia ideal:</strong> ${potencia}</div>
      <div class="line"><strong>Instalación:</strong> ${dificultad}</div>
      <div class="line"><strong>Preinstalación:</strong> ${preinstal}</div>
      <div class="line"><strong>WiFi:</strong> ${wifi}</div>
      <div class="line"><strong>Presupuesto orientativo:</strong> ${minPrice}€ – ${maxPrice}€</div>
    `;

    // WhatsApp CTA
    const phone = "34XXXXXXXXX"; // ← pon tu teléfono aquí
    const msg = encodeURIComponent(
      `Hola, vengo de la calculadora.\n` +
      `Equipo: ${equipo}\n` +
      `Potencia: ${potencia}\n` +
      `Presupuesto orientativo: ${minPrice}€ - ${maxPrice}€\n\n` +
      `Quiero presupuesto exacto.`
    );
    el('#wa-btn').href = `https://wa.me/${phone}?text=${msg}`

    state.recommendation = { equipo, potencia, minPrice, maxPrice, imgSrc };
  }

  /* Simple lead save (local only, no Brevo) */
  function setupLeadForm() {
    const form = el('#lead-form');
    if (!form) return;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = el('#lead-name').value.trim();
      const phone = el('#lead-phone').value.trim();
      const email = el('#lead-email').value.trim();

      if (!name || !phone) {
        el('.lead-feedback').textContent = 'Por favor, introduce nombre y teléfono.';
        return;
      }

      // Save locally
      const lead = {
        name,
        phone,
        email,
        recommendation: state.recommendation,
        date: new Date().toISOString()
      };

      const leads = JSON.parse(localStorage.getItem('ingnex_leads') || '[]');
      leads.push(lead);
      localStorage.setItem('ingnex_leads', JSON.stringify(leads));

      el('.lead-feedback').textContent = 'Datos recibidos. Te contactaremos 👌';
      form.reset();
    });
  }

})();
