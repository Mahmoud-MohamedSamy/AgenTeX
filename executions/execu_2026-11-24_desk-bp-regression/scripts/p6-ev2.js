// Screenshots for the second filing batch (Agent B).
const EV = JSON.parse(require('fs').readFileSync(require('path').resolve('../evidence/plane-evidence2.json'), 'utf8'));
const out = {};
const hist = async (name) => { const ht = page.getByRole('tab', { name: /History/i }).first(); if (await ht.count()) { await ht.click({ timeout: 8000 }).catch(() => {}); await sleep(4000); await shot(name); return (await text()); } return ''; };
// EN-13
await go('/views/all/tickets/' + EV.en13.ticket); await sleep(10000); await shot('EW-EN13-ticket');
let t = await hist('EW-EN13-history'); out.en13 = (t.match(/Status (changed|was)[^\n]*/g) || []).slice(0, 4);
// RS-01 in blueprint / no blueprint
await go('/views/all/tickets/' + EV.rs01.inBlueprint.ticket); await sleep(9000); t = await hist('EW-RS01-history-blueprint'); out.rsBp = (t.split('\n').filter(x => /owner/i.test(x))).slice(0, 6);
await go('/views/all/tickets/' + EV.rs01.noBlueprint.ticket); await sleep(9000); t = await hist('EW-RS01-history-plain'); out.rsPlain = (t.split('\n').filter(x => /owner/i.test(x))).slice(0, 6);
// UX-01 Arabic
await page.evaluate(() => { localStorage.setItem('anyware_language', 'ar'); localStorage.setItem('anyware_language_explicit', 'ar'); });
await go('/views/all/tickets/' + EV.ux01.ticket); await sleep(10000); await shot('EW-UX01-arabic-ticket'); t = await text(); out.ar = { open: /\bOpen\b/.test(t), closed: /\bClosed\b/.test(t), escalated: /\bEscalated\b/.test(t) };
await page.evaluate(() => { localStorage.setItem('anyware_language', 'en'); localStorage.setItem('anyware_language_explicit', 'en'); });
await go('/views/all/tickets/' + EV.ux01.ticket); await sleep(6000);
return out;
