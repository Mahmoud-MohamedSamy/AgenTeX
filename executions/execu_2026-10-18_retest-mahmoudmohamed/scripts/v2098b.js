const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const open = async (id, tag) => { const errs = []; const ce = r => { if (r.status() >= 500) errs.push(r.status() + ' ' + r.url().replace(H, '').slice(0, 90)); }; page.on('response', ce);
  await page.goto(H + '/modules/' + L + '?view=' + id, { waitUntil: 'commit', timeout: 120000 });
  const toasts = new Set(); let shotDone = false;
  for (let i = 0; i < 50; i++) { await sleep(500); for (const t of await page.locator('[data-sonner-toast]').allInnerTexts().catch(() => [])) if (t.trim() && !/Loading/.test(t)) { toasts.add(t.replace(/\s+/g, ' ').trim()); if (!shotDone) { await shot('NDC-2098-' + tag); shotDone = true; } } }
  if (!shotDone) await shot('NDC-2098-' + tag);
  let view = ''; for (let j = 0; j < 20; j++) { view = (await page.locator('button[aria-label="Custom views"]').innerText().catch(() => '')).trim(); if (view && view !== 'Choose a view') break; await sleep(1000); } await shot('NDC-2098-' + tag + '-settled');
  page.off('response', ce); return { url: page.url().replace(H, ''), toasts: [...toasts], view, http5xx: errs.slice(0, 3) }; };
out.own = await open('8dceae79-4e80-459c-801b-5291dd0714f0', 'own');
out.deleted = await open('0b48bfa9-555c-40e4-b744-6e5eb702b8a4', 'deleted');
out.foreign = await open('4495c2fb-f02e-4003-9437-a2b0010a0849', 'foreign');
out.foreignNameShown = /review-gate/.test(await txt());
return done(out);
