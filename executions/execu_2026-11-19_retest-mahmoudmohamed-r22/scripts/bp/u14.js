const out = {}; const RAWD = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
const maskIp = () => page.evaluate(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (/\d+\.\d+\.\d+\.\d+/.test(n.nodeValue) && !/172\.19\./.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(\d+\.\d+)\.\d+\.\d+/g, '$1.x.x'); } });
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/IP /.test(await text())) break; }
await sleep(2000);
const targets = { restore: /restored a Ticket named.*3027 delete restore|QA RT20 BP-3027 delete restore/, dept: /QA RT20 BP Dept B/ };
for (let s = 0; s < 25; s++) {
  const t = (await text()).replace(/[\w.+-]+@[\w.-]+/g, '<mail>'); const lines = t.split('\n').filter(l => /3027|Dept B|IsActive|EngineDeleted/.test(l)); out.lines = [...new Set([...(out.lines || []), ...lines])].slice(0, 20);
  const el = page.getByText(/3027 delete restore/).first(); if (await el.count() && !out.shot) { await el.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, -150); await sleep(800); await maskIp(); await page.screenshot({ path: RAWD + '3027-1-audit.png' }); out.shot = 1; }
  if (out.shot && out.lines.some(l => /Dept B/.test(l)) ) break;
  await page.mouse.move(900, 600); await page.mouse.wheel(0, 1500); await sleep(1500);
}
const d = page.getByText(/QA RT20 BP Dept B/).first(); if (await d.count()) { await d.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, -250); await sleep(800); await maskIp(); await page.screenshot({ path: RAWD + '3027-2-audit-dept.png' }); }
return out;
