#!/usr/bin/env node
// Shared Sheepdog instruction builder for Claude/Codex hooks and Pi extension.

const fs = require('fs');
const path = require('path');

const SKILL_PATH = path.join(__dirname, '..', 'skills', 'sheepdog', 'SKILL.md');

function stripFrontmatter(body) {
  return String(body || '').replace(/^---[\s\S]*?---\s*/, '');
}

function getFallbackInstructions() {
  return 'SHEEPDOG MODE ACTIVE\n\n' +
    'You are a working border collie at the edge of the field. Every module/layer is a field. ' +
    'Every responsibility is a sheep. Ask: does this belong here?\n\n' +
    'Boundary laws: 1 Entrypoints route only. 2 Orchestrators coordinate only. ' +
    '3 Business decisions live in decision/domain/policy modules. ' +
    '4 External side effects go behind adapter/service plus idempotency guard. ' +
    '5 Persistence goes through store/repository/data layer. ' +
    '6 Reuse existing patterns before creating parallel implementations. ' +
    '7 Respect dependency direction; no shortcuts/cycles. ' +
    '8 Existing god files are not precedent for new responsibility.\n\n' +
    'If blocked, report the stray sheep, wrong field, right field, and smallest safe move.';
}

function getSheepdogInstructions() {
  try {
    return 'SHEEPDOG MODE ACTIVE\n\n' + stripFrontmatter(fs.readFileSync(SKILL_PATH, 'utf8'));
  } catch (_e) {
    return getFallbackInstructions();
  }
}

module.exports = {
  getFallbackInstructions,
  getSheepdogInstructions,
  stripFrontmatter,
};
