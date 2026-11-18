const out = {}; const RAWD = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
const maskIp = () => page.evaluate(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (/\d+\.\d+\.\d+\.\d+/.test(n.nodeValue) && !/172\.19\./.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(\d+\.\d+)\.\d+\.\d+/g, '$1.x.x'); } });
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/IP /.test(await text())) break; }
await sleep(2000);
const targets = { iam: /GRANT desk:ticket:share/ };
for (let s = 0; s < 40; s++) {
  for (const [k, re] of Object.entries(targets)) { if (out[k]) continue; const el = page.getByText(re).first(); if (await el.count()) { await el.scrollIntoViewIfNeeded(); await sleep(800); await maskIp(); const b = await el.boundingBox(); out[k] = b && [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)]; await page.screenshot({ path: RAWD + '3067-2-' + k + '.png' }); } }
  if (out.iam) break;
  await page.mouse.move(900, 600); await page.mouse.wheel(0, 2500); await sleep(1500);
}
return out;
