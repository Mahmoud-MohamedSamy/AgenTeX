const items = ['Billing & Credits', 'Company Settings', 'Pipelines', 'Teamspace', 'Data Types', 'Capabilities', 'Skills', 'API Integration', 'AI Features', 'AI Health', 'AI Credits', 'Usage Overview', 'Buckets & S3', 'Storage Requests', 'Modules and Fields'];
const res = [];
const content = async () => page.evaluate(() => { const nav = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Setup Home'); let side = nav; for (let i = 0; i < 8 && side && side.parentElement; i++) { side = side.parentElement; if (side.tagName === 'ASIDE' || side.tagName === 'NAV') break; } const all = (document.querySelector('main') || document.body).innerText; const st = side ? side.innerText : ''; return all.replace(st, '').replace(/\s+/g, ' ').trim(); });
for (const it of items) {
  await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); await sleep(3000);
  const bad = []; const on = r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^https:\/\/[^/]+\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id').slice(0, 90)); };
  page.on('response', on);
  const t0 = Date.now();
  await page.locator('button', { hasText: it }).first().click().catch(e => bad.push('click ' + e.message.slice(0, 50)));
  let txt = '';
  for (let i = 0; i < 30; i++) { await sleep(1000); txt = await content(); if (!/Loading/i.test(txt.slice(0, 120)) && txt.length > 40) break; }
  const secs = Math.round((Date.now() - t0) / 100) / 10;
  await shot('t2-' + it.replace(/[^a-z0-9]+/gi, '-').toLowerCase());
  page.off('response', on);
  res.push({ it, url: page.url().replace(H, ''), secs, text: txt.slice(0, 700), bad: [...new Set(bad)].filter(b => !/telephony/.test(b)).slice(0, 8) });
}
return res;
