const test = require('node:test');
const assert = require('node:assert/strict');

const calc = require('../ui/calculator.js');

const basePayload = {
  band: 'Band 3',
  years: 0,
  country: 'England',
  londonArea: 'none',
  hoursPerWeek: 37.5,
  daysPerWeek: 5,
  includePension: true,
  taxCode: '1257L',
  unsocialIncome: 0,
  unsocialPeriod: 'monthly',
  studentPlans: []
};

test('returns a positive take-home for standard full-time band 3', () => {
  const res = calc.runCalculation(basePayload);
  assert.ok(res.netAnnual > 0);
  assert.equal(res.band, 'Band 3');
});

test('part-time hours reduce base salary', () => {
  const fullTime = calc.runCalculation(basePayload);
  const partTime = calc.runCalculation({ ...basePayload, hoursPerWeek: 18.75 });
  assert.ok(partTime.baseSalary < fullTime.baseSalary);
});

test('london weighting applied only in England', () => {
  const england = calc.runCalculation({ ...basePayload, londonArea: 'inner', country: 'England' });
  const scotland = calc.runCalculation({ ...basePayload, londonArea: 'inner', country: 'Scotland' });
  assert.ok(england.londonWeighting > 0);
  assert.equal(scotland.londonWeighting, 0);
});

test('student loan increases deductions when enabled', () => {
  const noLoan = calc.runCalculation(basePayload);
  const withLoan = calc.runCalculation({ ...basePayload, band: 'Band 7', years: 5, studentPlans: ['plan2'] });
  const noLoanHigh = calc.runCalculation({ ...basePayload, band: 'Band 7', years: 5, studentPlans: [] });
  assert.ok(withLoan.studentLoan > noLoanHigh.studentLoan);
  assert.ok(withLoan.netAnnual < noLoanHigh.netAnnual);
});
