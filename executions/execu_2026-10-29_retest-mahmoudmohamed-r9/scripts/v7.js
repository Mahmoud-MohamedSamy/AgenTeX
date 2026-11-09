const out = {};
const sel = page.locator('select').filter({ has: page.locator('option', { hasText: 'QA AEO Layout SE' }) }).first(); out.opts = (await sel.locator('option').allInnerTexts()).slice(0, 30); await sel.selectOption({ label: 'Standard' }); 
for (let j = 0; j < 45 && !(await txt()).includes('QA RT r8 deal'); j++) await sleep(2000); await sleep(2000); await shot('v7-deals-standard');
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); const i = t.indexOf('QA RT r8 deal'); out.row = t.slice(Math.max(0, i - 4), i + 8); out.rawIds = t.filter(l => /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(l)).slice(0, 3);
out.pipelineCells = [...new Set(t.filter(l => /^(Standard( \(Default\))?|1|Standard \(Standard\))$/.test(l)))];
return done(out);
