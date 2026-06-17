const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const skills = ['sheepdog', 'sheepdog-review', 'sheepdog-audit', 'sheepdog-loop', 'sheepdog-debt', 'sheepdog-help'];

test('all skills have valid frontmatter', () => {
  for (const skill of skills) {
    const body = fs.readFileSync(path.join(root, 'skills', skill, 'SKILL.md'), 'utf8');
    assert.match(body, /^---\nname: [a-z0-9-]+\n/);
    assert.match(body, /description:/);
  }
});

test('sheepdog instructions include all boundary laws', () => {
  const { getSheepdogInstructions } = require('../hooks/sheepdog-instructions');
  const text = getSheepdogInstructions();
  for (const phrase of [
    'Entrypoint Law',
    'Orchestrator Law',
    'Decision Owner Law',
    'Side-Effect Law',
    'Persistence Law',
    'Pattern Reuse Law',
    'Dependency Direction Law',
    'God-Gravity Law',
  ]) {
    assert.match(text, new RegExp(phrase));
  }
});
