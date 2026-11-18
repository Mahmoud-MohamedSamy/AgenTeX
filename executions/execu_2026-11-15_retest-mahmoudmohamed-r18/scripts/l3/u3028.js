const K = process.env.K || '1'; const res = []; const t0 = Date.now(); const reqb = [];
page.on('response', async r => { const u = r.url(); const m = r.request().method(); if (/api\/v1/.test(u) && m !== 'GET' && !/heartbeat|realtime|query|search|summaries|iam\/auth|resolved-batch|notifications/.test(u)) { res.push({ t: Date.now() - t0, m, s: r.status(), u: u.replace(/^.*api\/v1/, '').replace(/[0-9a-f-]{36}/g, ':id').slice(0, 80), b: (r.status() >= 300 || /bulk/.test(u)) ? (await r.text().catch(() => '')).slice(0, 2500) : '' }); if (reqb.length < 2) reqb.push((r.request().postData() || '').slice(0, 300)); } });
await page.goto(H + '/views', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/All Tickets/.test(await text())) break; }
const lk = page.getByText('QA RT18 3028 view', { exact: true }).first(); await lk.scrollIntoViewIfNeeded(); await lk.click();
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT18 3028 \d\d/.test(await text())) break; } await sleep(3000);
log('rows', ((await text()).match(/QA RT18 3028 \d\d/g) || []).length);
await page.getByRole('checkbox', { name: /select all/i }).first().click(); await sleep(2000);
log('after header', ((await text()).match(/[^\n]*selected[^\n]*|Select all \d+[^\n]*/gi) || []).slice(0, 3));
const link = page.getByText(/Select all \d+ in this view/i).first(); log('link', await link.innerText().catch(() => 'none')); if (await link.count()) { await link.click(); await sleep(2000); }
log('selected', ((await text()).match(/[^\n]*selected[^\n]*/gi) || []).slice(0, 2)); await shot('3028-' + K + 'a-selected.png');
await page.getByRole('button', { name: /^Close$/ }).first().click(); await sleep(2000);
const dlg = page.locator('[role=dialog], [role=alertdialog]').last(); log('dialog', (await dlg.innerText().catch(() => '')).replace(/\n/g, ' | ').slice(0, 300)); await shot('3028-' + K + 'b-confirm.png');
await dlg.getByRole('button', { name: /^Close \d+ tickets?/ }).last().click();
const toasts = new Set(); const tq = async () => { for (const t of await page.locator('[data-sonner-toast], [role=status], [role=alert], .toast, ol li[data-type]').allInnerTexts().catch(() => [])) if (t.trim()) toasts.add(t.replace(/\s+/g, ' ').slice(0, 200)); };
const nres = () => res.filter(x => /bulk/.test(x.u)).reduce((n, x) => { try { return n + JSON.parse(x.b).data.results.length; } catch (e) { return n; } }, 0);
let doneAt = -1; for (let i = 0; i < 420; i++) { await sleep(1000); await tq(); if (i % 30 === 5) await shot('3028-' + K + 'c-progress-' + i + 's.png'); if (nres() >= 60 && doneAt < 0) { doneAt = i; log('all results at', i); } if (doneAt >= 0 && i === doneAt + 1) await shot('3028-' + K + 'c-result-done.png'); if (doneAt >= 0 && i > doneAt + 12) break; }
log('bulk calls', res.filter(x => /bulk/.test(x.u)).map(x => { try { const d = JSON.parse(x.b).data; return { t: x.t, n: d.results.length, ok: d.succeeded, failed: d.failed, errs: d.results.filter(r => !r.ok).slice(0, 2) }; } catch (e) { return { t: x.t, s: x.s, b: x.b.slice(0, 200) }; } }));
log('toasts', [...toasts]);
const by = {}; res.forEach(x => { const k = x.m + ' ' + x.u + ' ' + x.s; by[k] = (by[k] || 0) + 1; }); log('responses', by, 'span', res.length ? res[res.length - 1].t - res[0].t : 0);
log('errs', res.filter(x => x.s >= 300).slice(0, 3));  log('reqbody', reqb);
await page.reload({ waitUntil: 'domcontentloaded' }); for (let i = 0; i < 20; i++) { await sleep(2000); if (/QA RT18 3028|No (tickets|records)/.test(await text())) break; } await sleep(3000);
await shot('3028-' + K + 'd-after-reload.png'); log('after reload rows', ((await text()).match(/QA RT18 3028 \d\d/g) || []).length);
