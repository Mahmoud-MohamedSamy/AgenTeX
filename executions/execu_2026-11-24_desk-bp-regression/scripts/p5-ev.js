// Screenshots for the Plane evidence images. WHICH=1 (Agent B, ticket of bug 1) or WHICH=3 (Agent A, ticket of bug 3).
const EV = JSON.parse(require('fs').readFileSync(require('path').resolve('../evidence/plane-evidence.json'), 'utf8'));
const which = process.env.WHICH || '1';
const out = {};
if (which === '1') {
  await go('/views/all/tickets/' + EV.bug1.ticket); await sleep(10000);
  await shot('EV1-ticket-after-transition');
  const t = await text(); out.hasZzz = t.includes('zzz-not-an-option'); out.hasX = /XXXXXXXXXX/.test(t);
  // open the properties edit area if fields are collapsed
  const props = page.getByText('Ticket Properties').first(); if (await props.count()) { await page.mouse.wheel(0, 0); }
  for (const lbl of ['Category', 'QA NDC TKT/PNR NO']) { const el = page.getByText(lbl, { exact: true }).first(); if (await el.count()) { await el.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot('EV1-field-' + lbl.replace(/[^A-Za-z]/g, '')); out['seen ' + lbl] = true; } }
  // history
  const ht = page.getByRole('tab', { name: /History/i }).first(); if (await ht.count()) { await ht.click({ timeout: 8000 }).catch(() => {}); await sleep(3500); await shot('EV1-history'); const h = await text(); out.historyZzz = h.includes('zzz-not-an-option'); }
}
if (which === '3') {
  await go('/views/all/tickets/' + EV.bug3.ticket); await sleep(10000); await shot('EV3-ticket-as-agent-A');
  const t = await text(); out.approveButton = /QA Approve/.test(t); out.followsBlueprint = /follows blueprint/.test(t);
}
return out;
