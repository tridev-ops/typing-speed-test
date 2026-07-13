import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAccuracy, calculateWPM, formatTime } from './stats.js';

test('calculateWPM uses elapsed time and correct characters', () => {
  assert.equal(calculateWPM(50, 60), 10);
  assert.equal(calculateWPM(25, 60), 5);
  assert.equal(calculateWPM(0, 60), 0);
});

test('calculateAccuracy returns a percentage from correct and total attempts', () => {
  assert.equal(calculateAccuracy(8, 10), 80);
  assert.equal(calculateAccuracy(5, 5), 100);
  assert.equal(calculateAccuracy(0, 0), 100);
});

test('formatTime pads minutes and seconds', () => {
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(5), '0:05');
});
