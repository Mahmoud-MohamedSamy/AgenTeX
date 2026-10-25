// NDC-2098 recheck: toast capture via MutationObserver installed before navigation.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', FOREIGN = '1cb2da03-3a80-4720-9ca6-07c5a3758b85', GONE = 'ff0a79b9-c822-4fd0-96ab-00c60a88c920';
await page.addInitScript(() => { window.__toasts = []; const grab = () => document.querySelectorAll('[data-sonner-toast], [role=status], [role=alert], li[data-type]').forEach(e => { const t = e.innerText.trim(); if (t && !window.__toasts.includes(t)) window.__toasts.push(t); }); new MutationObserver(grab).observe(document, { subtree: true, childList: true, characterData: true }); });
const prefs = (await api('GET', `/modules/${L}/list-preferences`)).j?.data?.prefs || {};
const out = { lastListViewId: prefs.lastListViewId || null };
for (const [k, id] of [['own-first', '13996de8-93e5-4437-b546-03d1caca1194'], ['deleted2', GONE], ['own-again', '13996de8-93e5-4437-b546-03d1caca1194'], ['foreign2', FOREIGN]]) {
  await page.goto(H + `/modules/${L}?view=${id}`, { waitUntil: 'commit', timeout: 120000 });
  let stable = 0, prev = ''; for (let i = 0; i < 150; i++) { await sleep(1000); const lbl = (await page.locator('button[aria-label="Custom views"]').innerText().catch(() => '')).trim(); const t = await txt().catch(() => ''); const c = (t.match(/([\d,]+) records/) || [])[1] || ''; const cur = lbl + '|' + c; if (lbl && c && !/Choose a view/.test(lbl) && !/Loading/.test(t)) { stable = cur === prev ? stable + 1 : 0; prev = cur; if (stable >= 8) break; } }
  await shot('2098-z-' + k);
  out[k] = { last: ((await api('GET', `/modules/${L}/list-preferences`)).j?.data?.prefs || {}).lastListViewId, view: prev, toasts: await page.evaluate(() => window.__toasts), query: page.url().split('?')[1] || '(none)', foreignShown: (await txt()).includes('QA RT 2098 foreign') };
}
return done(out);
