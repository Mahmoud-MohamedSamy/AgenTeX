const reqs = []; page.on('response', async r => { const u = r.url(); if (/api\/v1\/.*search/i.test(u)) { let t = ''; try { t = (await r.text()).slice(0, 300); } catch (e) {} reqs.push(r.status() + ' ' + decodeURIComponent(u.replace(/^.*api\/v1/, '')) + ' :: ' + t); } });
await page.goto(H + '/', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Search or jump/i.test(await text())) break; } await sleep(3000);
const out = {};
for (const [k, q] of [['hash', '#Rule A Done'], ['plain', 'Rule A Done'], ['hashPartial', '#Rule'], ['hashWF', '#Workflow Completed']]) {
  reqs.length = 0; await page.keyboard.press('Control+k'); await sleep(1500);
  await page.keyboard.type(q, { delay: 60 }); await sleep(5000);
  const dlg = page.locator('[role=dialog]').last(); const t = await dlg.innerText().catch(() => text());
  out[k] = { q, shown: t.slice(0, 700), api: reqs.slice(-3) };
  await shot('2628-' + k + '.png');
  await page.keyboard.press('Escape'); await sleep(1200);
}
return out;
