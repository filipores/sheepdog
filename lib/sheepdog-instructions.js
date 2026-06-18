// Shared Sheepdog instruction builder for Claude/Codex hooks and Pi extension.

const fs = require('fs');
const path = require('path');

const SKILL_PATH = path.join(__dirname, '..', 'skills', 'sheepdog', 'SKILL.md');

function stripFrontmatter(body) {
  return String(body || '').replace(/^---[\s\S]*?---\s*/, '');
}

function getSheepdogInstructions() {
  return 'SHEEPDOG MODE ACTIVE\n\n' + stripFrontmatter(fs.readFileSync(SKILL_PATH, 'utf8'));
}

module.exports = {
  getSheepdogInstructions,
  stripFrontmatter,
};
