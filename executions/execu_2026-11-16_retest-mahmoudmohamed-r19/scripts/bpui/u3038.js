const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const BR = process.env.BR || 'edge'; const res = [];
const measure = async () => page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const labs = [...document.querySelectorAll('.react-flow__edgelabel-renderer *, .react-flow__edge-textwrapper, .react-flow__edge-text')].filter(e => /^QA [tb]\d+/.test((e.innerText || e.textContent || '').trim()) && e.children.length <= 2 && vis(e));
  // keep innermost label boxes
  const L = labs.filter(e => !labs.some(o => o !== e && e.contains(o))).map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || e.textContent).trim(), x1: r.left, y1: r.top, x2: r.right, y2: r.bottom }; });
  const btns = [...document.querySelectorAll('.react-flow__edgelabel-renderer button')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return { t: 'btn', x1: r.left, y1: r.top, x2: r.right, y2: r.bottom }; }).filter(b => !L.some(l => b.x1 >= l.x1 - 1 && b.x2 <= l.x2 + 1 && b.y1 >= l.y1 - 1 && b.y2 <= l.y2 + 1));
  const nodes = [...document.querySelectorAll('.react-flow__node')].map(e => { const r = e.getBoundingClientRect(); return { x1: r.left, y1: r.top, x2: r.right, y2: r.bottom }; });
  const ov = (a, b) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1;
  let ll = 0, lb = 0, ln = 0; const ex = [];
  for (let i = 0; i < L.length; i++) { for (let j = i + 1; j < L.length; j++) if (ov(L[i], L[j])) { ll++; if (ex.length < 4) ex.push(L[i].t + ' x ' + L[j].t); } for (const b of btns) if (ov(L[i], b)) lb++; for (const n of nodes) if (ov(L[i], n)) ln++; }
  return { labels: L.length, visibleButtons: btns.length, labelLabel: ll, labelButton: lb, labelNode: ln, ex };
});
for (let run = 1; run <= 3; run++) { if (run === 2) { const s0 = Date.now(); await page.goto(H + '/settings/automation/blueprints/cca267b4-989c-47e8-8fa2-70b9d5935626', { waitUntil: 'domcontentloaded' }); await page.locator('.react-flow__node').nth(2).waitFor({ timeout: 180000 }); res.push({ smallBlueprint3nodesMs: Date.now() - s0 }); }
  const t0 = Date.now(); await page.goto(H + '/settings/automation/blueprints/d03c1921-889a-40bb-b8d4-55b269e595f8', { waitUntil: 'domcontentloaded' });
  await page.locator('.react-flow__node').nth(29).waitFor({ timeout: 180000 }); const tl = Date.now() - t0;
  await page.locator('.react-flow__edge').nth(79).waitFor({ state: 'attached', timeout: 60000 }).catch(() => {}); const te = Date.now() - t0;
  res.push({ run, nodes30ms: tl, edges80ms: te, nodes: await page.locator('.react-flow__node').count(), edges: await page.locator('.react-flow__edge').count() });
}
await sleep(2000);
const m1 = await measure(); log('overlap default view', m1); await page.screenshot({ path: RAW + '3038-' + BR + '-default.png' });
const fit = page.getByRole('button', { name: /Fit/ }).first(); if (await fit.count()) { await fit.click(); await sleep(1500); }
const m2 = await measure(); log('overlap after fit', m2); await page.screenshot({ path: RAW + '3038-' + BR + '-fit.png' });
// hover a label: buttons appear?
const lab = page.getByText('QA t5_6', { exact: true }).first(); if (await lab.count()) { await lab.hover(); await sleep(800); log('after hover', await measure()); await page.screenshot({ path: RAW + '3038-' + BR + '-hover.png' }); }
const t1 = Date.now(); await page.locator('.react-flow__node').nth(5).click(); await page.waitForTimeout(200); log('select node ms', Date.now() - t1);
return { timings: res };
