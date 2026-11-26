// Screenshots for the second filing batch (Agent B).
const EV = JSON.parse(require('fs').readFileSync(require('path').resolve('../evidence/plane-evidence2.json'), 'utf8'));
const out = {};
const hist = async (name) => { if (/login|sign/i.test(page.url())) return 'SIGNED OUT'; const ht = page.getByRole('tab', { name: /History/i }).first(); if (await ht.count()) { await ht.click({ timeout: 8000 }).catch(() => {}); await sleep(4000); await shot(name); return (await text()); } return ''; };
// EN-13
await go('/views/all/tickets/' + EV.en13.ticket); await sleep(10000); await shot('EW-EN13-ticket');
let t = await hist('EW-EN13-history'); out.en13 = (t.match(/Status (changed|was)[^\n]*/g) || []).slice(0, 4);
// RS-01 in blueprint / no blueprint
await go('/views/all/tickets/' + EV.rs01.inBlueprint.ticket); await sleep(9000); t = await hist('EW-RS01-history-blueprint'); out.rsBp = (t.split('\n').filter(x => /owner/i.test(x))).slice(0, 6);
await go('/views/all/tickets/' + EV.rs01.noBlueprint.ticket); await sleep(9000); t = await hist('EW-RS01-history-plain'); out.rsPlain = (t.split('\n').filter(x => /owner/i.test(x))).slice(0, 6);
return out;
