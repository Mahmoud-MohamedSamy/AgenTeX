// Writes bug-drafts.md from bug-drafts.js
const D = require('./bug-drafts.js'); const rec = { file: 'Ready to file', check: 'Check one thing first', decide: 'Decision / Zoho check first' };
let md = `# Desk Workflow Rules — Plane drafts (not filed)\n\nFrom the regression runs 1 + 2 (22–23 Nov 2026) and the fail retest (23 Nov), NDC-Staging. ${D.length} drafts: ${D.filter(d => d.kind === 'FAIL').length} fails, ${D.filter(d => d.kind !== 'FAIL').length} findings.\n\n`;
for (const b of D) md += `## ${b.title}\n\n*${b.id}${b.also ? ' + ' + b.also : ''} · ${b.kind} · suggested priority ${b.pri} · ${rec[b.rec]}*\n\n**Steps**\n${b.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n**Expected:** ${b.expected}\n\n**Actual:** ${b.actual}\n\n${b.check ? `**Before filing:** ${b.check}\n\n` : ''}**Environment:** NDC-Staging, Desk → Tickets. ${b.evidence}\n\n`;
require('fs').writeFileSync(__dirname + '/bug-drafts.md', md); console.log('drafts', D.length);
