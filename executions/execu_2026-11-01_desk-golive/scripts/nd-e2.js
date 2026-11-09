const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const ed = async () => page.$$eval('[contenteditable=true]', es => es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim().slice(0, 200)));
// current page: cancel composer
const cancel = page.locator('button', { hasText: /^Cancel$/ }).last(); o.cancel = await cancel.count(); if (o.cancel) { await cancel.click().catch(() => {}); await sleep(2000); const dlg = await page.$$eval('[role=dialog], [role=alertdialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 200))); o.cancelDialog = dlg; if (dlg.length) { const keep = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Keep|Save draft|Close/ }).first(); if (await keep.count()) await keep.click().catch(() => {}); else await page.keyboard.press('Escape'); await sleep(1500); } }
let g = await api('GET', `/desk/tickets/${IDS.base}/drafts`); o.baseDraftsAfterCancel = arr(g.j && g.j.data).map(d => [d.id, (d.body_html || '').slice(0, 90), d.review_status || d.review || d.status, Object.keys(d).join(',').slice(0, 300)]);
// clean repro on child 2: save a reply draft (not in review), open page, Shift+C
const P = `/desk/tickets/${IDS.child_2}`; o.c2Draft = sh(await api('PUT', `${P}/drafts/mine`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 child 2', body_html: '<p>QA GL W2 plain reply draft</p>' }));
await page.goto(H + '/views/all/tickets/' + IDS.child_2, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 child 2/, 90); await sleep(3000);
o.editorsBefore = await ed(); o.headerBtn = (await txt()).match(/Reply All\s*DRAFT|Reply\s*DRAFT/) ? 'draft badge' : 'no badge';
await page.locator('main').first().click({ position: { x: 600, y: 20 } }).catch(() => {}); await page.keyboard.press('Escape'); await page.keyboard.press('Shift+C'); await sleep(3000);
o.editorsAfterShiftC = await ed(); o.composerMode = (await txt()).match(/Comment\s*Private|Send\s|Reply All/g); o.shotShiftC = await shot('../wave2n/ui-shiftc-draft');
// also the explicit comment icon in the header
await page.keyboard.press('Escape'); await sleep(1000);
const cancel2 = page.locator('button', { hasText: /^Cancel$/ }).last(); if (await cancel2.count()) { await cancel2.click().catch(() => {}); await sleep(1500); const dlg = await page.$$eval('[role=dialog], [role=alertdialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 200))); o.cancel2Dialog = dlg; if (dlg.length) await page.keyboard.press('Escape'); }
const ic = page.locator('button[aria-label*="omment"]').first(); o.commentIcon = await ic.count(); if (o.commentIcon) { await ic.click().catch(() => {}); await sleep(3000); o.editorsAfterIcon = await ed(); o.shotIcon = await shot('../wave2n/ui-commenticon-draft'); }
g = await api('GET', `${P}/drafts`); o.c2DraftsAfter = arr(g.j && g.j.data).map(d => [d.id, (d.body_html || '').slice(0, 80)]);
return done(o);
