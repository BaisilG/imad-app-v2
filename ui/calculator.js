(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
    return;
  }
  root.NhsCalculator = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var FULL_TIME_HOURS = 37.5;

  var AFC_PAY = {
    'Band 1': { steps: [{ minYears: 0, england: 25272, ni: 24465, scotland: 26658, wales: 26300 }] },
    'Band 2': { steps: [{ minYears: 0, england: 25272, ni: 24465, scotland: 26658, wales: 26300 }, { minYears: 2, england: 25272, ni: 24465, scotland: 28947, wales: 26300 }] },
    'Band 3': { steps: [{ minYears: 0, england: 25760, ni: 24937, scotland: 29061, wales: 26300 }, { minYears: 2, england: 27476, ni: 26598, scotland: 31364, wales: 27890 }] },
    'Band 4': { steps: [{ minYears: 0, england: 28392, ni: 27485, scotland: 31492, wales: 28819 }, { minYears: 3, england: 31157, ni: 30162, scotland: 34254, wales: 31626 }] },
    'Band 5': { steps: [{ minYears: 0, england: 32073, ni: 31049, scotland: 34494, wales: 32557 }, { minYears: 2, england: 34592, ni: 33487, scotland: 36857, wales: 35114 }, { minYears: 4, england: 39043, ni: 37796, scotland: 42977, wales: 39631 }] },
    'Band 6': { steps: [{ minYears: 0, england: 39959, ni: 38682, scotland: 43169, wales: 40559 }, { minYears: 2, england: 42170, ni: 40823, scotland: 45070, wales: 42805 }, { minYears: 5, england: 48117, ni: 46580, scotland: 52603, wales: 48841 }] },
    'Band 7': { steps: [{ minYears: 0, england: 49387, ni: 47810, scotland: 52769, wales: 50129 }, { minYears: 2, england: 51932, ni: 50273, scotland: 54784, wales: 52712 }, { minYears: 5, england: 56515, ni: 54710, scotland: 61377, wales: 57365 }] },
    'Band 8a': { steps: [{ minYears: 0, england: 57528, ni: 55690, scotland: 65032, wales: 58379 }, { minYears: 2, england: 60417, ni: 58487, scotland: 65032, wales: 61317 }, { minYears: 5, england: 64750, ni: 62682, scotland: 70202, wales: 65723 }] },
    'Band 8b': { steps: [{ minYears: 0, england: 66582, ni: 64455, scotland: 76778, wales: 67583 }, { minYears: 2, england: 70896, ni: 68631, scotland: 76778, wales: 71952 }, { minYears: 5, england: 77368, ni: 74896, scotland: 82133, wales: 78530 }] },
    'Band 8c': { steps: [{ minYears: 0, england: 79504, ni: 76965, scotland: 90678, wales: 80698 }, { minYears: 2, england: 84346, ni: 81652, scotland: 90678, wales: 85611 }, { minYears: 5, england: 91609, ni: 88682, scotland: 97199, wales: 92984 }] },
    'Band 8d': { steps: [{ minYears: 0, england: 94356, ni: 91342, scotland: 107655, wales: 95773 }, { minYears: 2, england: 100140, ni: 96941, scotland: 107655, wales: 101643 }, { minYears: 5, england: 108814, ni: 105337, scotland: 112264, wales: 110448 }] },
    'Band 9': { steps: [{ minYears: 0, england: 112782, ni: 109179, scotland: 127338, wales: 114475 }, { minYears: 2, england: 119583, ni: 115763, scotland: 127338, wales: 121377 }, { minYears: 5, england: 129783, ni: 125637, scotland: 132853, wales: 131732 }] }
  };

  var LONDON = {
    inner: { pct: 0.2, min: 5791, max: 8745 },
    outer: { pct: 0.15, min: 4869, max: 6137 },
    fringe: { pct: 0.05, min: 1346, max: 2270 },
    none: { pct: 0, min: 0, max: 0 }
  };

  var PENSION = {
    rUK: [{ upTo: 13259, rate: 0.052 }, { upTo: 28854, rate: 0.065 }, { upTo: 35155, rate: 0.083 }, { upTo: 52778, rate: 0.098 }, { upTo: 67668, rate: 0.107 }, { upTo: Infinity, rate: 0.125 }],
    scotland: [{ upTo: 13930, rate: 0.057 }, { upTo: 27966, rate: 0.064 }, { upTo: 33094, rate: 0.07 }, { upTo: 41522, rate: 0.087 }, { upTo: 43544, rate: 0.098 }, { upTo: 59929, rate: 0.105 }, { upTo: 80277, rate: 0.116 }, { upTo: Infinity, rate: 0.127 }]
  };

  var STUDENT_LOANS = {
    plan1: { threshold: 26065, rate: 0.09 },
    plan2: { threshold: 28470, rate: 0.09 },
    plan4: { threshold: 32745, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    postgrad: { threshold: 21000, rate: 0.06 }
  };

  function clampMoney(value) {
    return Math.max(0, Number(value) || 0);
  }

  function parseTaxAllowance(taxCode) {
    var match = (taxCode || '').toUpperCase().match(/(\d{2,4})/);
    if (!match) return 12570;
    return parseInt(match[1], 10) * 10;
  }

  function salaryForBand(band, country, years) {
    var key = country === 'Northern Ireland' ? 'ni' : country.toLowerCase();
    var steps = AFC_PAY[band].steps;
    var selected = steps[0];
    steps.forEach(function (step) {
      if (years >= step.minYears) selected = step;
    });
    return selected[key];
  }

  function calcLondon(baseAnnual, area) {
    var rule = LONDON[area] || LONDON.none;
    var raw = baseAnnual * rule.pct;
    return Math.min(rule.max, Math.max(rule.min, raw));
  }

  function pensionRate(country, annualPay) {
    var tiers = country === 'Scotland' ? PENSION.scotland : PENSION.rUK;
    for (var i = 0; i < tiers.length; i += 1) {
      if (annualPay <= tiers[i].upTo) return tiers[i].rate;
    }
    return 0;
  }

  function calcProgressiveTax(taxable, bands) {
    var remaining = taxable;
    var total = 0;
    var previousCap = 0;

    for (var i = 0; i < bands.length; i += 1) {
      if (remaining <= 0) break;
      var bandSize = Math.min(remaining, bands[i].cap - previousCap);
      if (bandSize > 0) {
        total += bandSize * bands[i].rate;
        remaining -= bandSize;
      }
      previousCap = bands[i].cap;
    }
    return total;
  }

  function calcIncomeTax(country, taxableAnnual, taxAllowance) {
    var pay = Math.max(0, taxableAnnual);
    var allowance = taxAllowance;
    if (pay > 100000) {
      allowance = Math.max(0, allowance - Math.floor((pay - 100000) / 2));
    }
    var taxable = Math.max(0, pay - allowance);

    if (country === 'Scotland') {
      return calcProgressiveTax(taxable, [
        { cap: 2306, rate: 0.19 },
        { cap: 13991, rate: 0.2 },
        { cap: 31092, rate: 0.21 },
        { cap: 62430, rate: 0.42 },
        { cap: 125140, rate: 0.45 },
        { cap: Infinity, rate: 0.48 }
      ]);
    }

    return calcProgressiveTax(taxable, [
      { cap: 37700, rate: 0.2 },
      { cap: 125140, rate: 0.4 },
      { cap: Infinity, rate: 0.45 }
    ]);
  }

  function calcNationalInsurance(pay) {
    var primary = 12570;
    var upper = 50270;
    var main = Math.max(0, Math.min(pay, upper) - primary) * 0.08;
    var extra = Math.max(0, pay - upper) * 0.02;
    return main + extra;
  }

  function calcStudentLoans(pay, plans) {
    return plans.reduce(function (sum, plan) {
      var rule = STUDENT_LOANS[plan];
      if (!rule) return sum;
      return sum + Math.max(0, pay - rule.threshold) * rule.rate;
    }, 0);
  }

  function nextBand(band) {
    var bandKeys = Object.keys(AFC_PAY);
    var index = bandKeys.indexOf(band);
    if (index < 0 || index === bandKeys.length - 1) return null;
    return bandKeys[index + 1];
  }

  function runCalculation(rawInput) {
    var band = rawInput.band;
    var years = clampMoney(rawInput.years);
    var country = rawInput.country;
    var hours = clampMoney(rawInput.hoursPerWeek);
    var includePension = !!rawInput.includePension;
    var londonArea = country === 'England' ? rawInput.londonArea : 'none';

    var fullTimeBase = salaryForBand(band, country, years);
    var baseSalary = fullTimeBase * (hours / FULL_TIME_HOURS);
    var londonWeighting = calcLondon(baseSalary, londonArea);
    var unsocialAnnual = rawInput.unsocialPeriod === 'monthly' ? clampMoney(rawInput.unsocialIncome) * 12 : clampMoney(rawInput.unsocialIncome);

    var grossAnnual = baseSalary + londonWeighting + unsocialAnnual;
    var pensionContribution = includePension ? grossAnnual * pensionRate(country, grossAnnual) : 0;
    var taxableAnnual = grossAnnual - pensionContribution;

    var tax = calcIncomeTax(country, taxableAnnual, parseTaxAllowance(rawInput.taxCode));
    var ni = calcNationalInsurance(taxableAnnual);
    var studentLoan = calcStudentLoans(taxableAnnual, rawInput.studentPlans || []);
    var netAnnual = Math.max(0, taxableAnnual - tax - ni - studentLoan);

    return {
      rawInput: rawInput,
      band: band,
      hoursPerWeek: hours,
      baseSalary: baseSalary,
      londonWeighting: londonWeighting,
      unsocialAnnual: unsocialAnnual,
      grossAnnual: grossAnnual,
      pension: pensionContribution,
      tax: tax,
      ni: ni,
      studentLoan: studentLoan,
      netAnnual: netAnnual,
      netMonthly: netAnnual / 12,
      nextBand: nextBand(band)
    };
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(amount);
  }

  return {
    AFC_PAY: AFC_PAY,
    runCalculation: runCalculation,
    formatCurrency: formatCurrency
  };
});
