(function () {
  var calculator = window.NhsCalculator;
  var bandKeys = Object.keys(calculator.AFC_PAY);
  var bandSelect = document.getElementById('band');
  var form = document.getElementById('calculator-form');
  var results = document.getElementById('results');

  bandKeys.forEach(function (band) {
    var option = document.createElement('option');
    option.value = band;
    option.textContent = band;
    if (band === 'Band 3') option.selected = true;
    bandSelect.appendChild(option);
  });

  function row(label, value) {
    return '<tr><td>' + label + '</td><td>' + value + '</td></tr>';
  }

  function card(label, value) {
    return '<article class="kpi"><div class="label">' + label + '</div><div class="value">' + value + '</div></article>';
  }

  function renderResult(model) {
    var upside = null;
    if (model.nextBand) {
      var promoted = calculator.runCalculation(Object.assign({}, model.rawInput, { band: model.nextBand }));
      upside = promoted.netAnnual - model.netAnnual;
    }

    results.classList.remove('hidden');
    results.innerHTML =
      '<h2>Your results</h2>' +
      '<div class="kpi-grid">' +
      card('Annual gross pay', calculator.formatCurrency(model.grossAnnual)) +
      card('Annual take-home', calculator.formatCurrency(model.netAnnual)) +
      card('Monthly take-home', calculator.formatCurrency(model.netMonthly)) +
      card('Effective hourly take-home', calculator.formatCurrency(model.netAnnual / (model.hoursPerWeek * 52))) +
      '</div>' +
      '<table class="breakdown">' +
      row('Basic salary (pro-rated)', calculator.formatCurrency(model.baseSalary)) +
      row('London weighting', calculator.formatCurrency(model.londonWeighting)) +
      row('Unsocial hours', calculator.formatCurrency(model.unsocialAnnual)) +
      row('NHS pension', '-' + calculator.formatCurrency(model.pension)) +
      row('Income tax', '-' + calculator.formatCurrency(model.tax)) +
      row('National Insurance', '-' + calculator.formatCurrency(model.ni)) +
      row('Student/postgrad loans', '-' + calculator.formatCurrency(model.studentLoan)) +
      row('<strong>Take-home pay</strong>', '<strong>' + calculator.formatCurrency(model.netAnnual) + '</strong>') +
      '</table>' +
      (upside !== null
        ? '<div class="upsell"><strong>Growth insight:</strong> if you move from ' +
          model.band +
          ' to ' +
          model.nextBand +
          ', your estimated take-home could increase by about <strong>' +
          calculator.formatCurrency(upside) +
          '</strong> per year.</div>'
        : '') +
      '<p class="small-text">Preview uses the built-in 2026/27 configuration and payroll assumptions.</p>';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var selectedLoans = Array.prototype.slice
      .call(document.querySelectorAll('.student-loans input:checked'))
      .map(function (input) {
        return input.value;
      });

    var model = calculator.runCalculation({
      band: document.getElementById('band').value,
      years: document.getElementById('years').value,
      country: document.getElementById('country').value,
      londonArea: document.getElementById('londonArea').value,
      hoursPerWeek: document.getElementById('hoursPerWeek').value,
      daysPerWeek: document.getElementById('daysPerWeek').value,
      includePension: document.getElementById('includePension').checked,
      taxCode: document.getElementById('taxCode').value,
      unsocialIncome: document.getElementById('unsocialIncome').value,
      unsocialPeriod: document.getElementById('unsocialPeriod').value,
      studentPlans: selectedLoans
    });

    renderResult(model);
  });
})();
