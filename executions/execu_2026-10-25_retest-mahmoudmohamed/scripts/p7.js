const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
for (const [k, id] of [['api', 'c60d7685-61a8-4f94-98cc-75ccbe0cdef0']]) {
  await page.goto(H + `/modules/${L}?view=${id}`, { waitUntil: 'commit', timeout: 90000 });
  let n = null; for (let i = 0; i < 120; i++) { await sleep(1000); const t = await txt().catch(() => ''); const m = t.match(/(\d[\d,]*) records?/); if (m && !/Loading Leads/.test(t)) { n = m[1]; break; } }
  await sleep(3000); const t = await txt(); out[k] = { count: (t.match(/(\d[\d,]*) records?/) || [])[1], rows: [...t.matchAll(/QA[^\n]{0,40}/g)].slice(0, 5).map(m => m[0]) }; await shot('2122-06-eval-' + k);
}
return done(out);
