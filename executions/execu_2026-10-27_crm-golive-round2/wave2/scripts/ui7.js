const H = 'https://staging-crm.taviportal.com', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288', B = H + '/api/v1';
const wait = ms => page.waitForTimeout(ms);
const ck = (await page.context().cookies()).find(c => c.name === 'aw_staging_access_token');
const HD = { authorization: 'Bearer ' + ck.value, 'x-app-key': 'crm', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'content-type': 'application/json' };
const api = async (m, p, body) => { const r = await page.context().request.fetch(B + p, { method: m, headers: HD, data: body ? JSON.stringify(body) : undefined, failOnStatusCode: false }); let j = null; try { j = await r.json(); } catch (e) {} return { s: r.status(), j }; };
const firstRow = async (sec) => { const t0 = Date.now(); try { await page.waitForFunction(() => [...document.querySelectorAll('tbody tr')].some(r => r.querySelectorAll('td').length > 3) || /No Leads found|No results/.test(document.body.innerText), null, { timeout: sec * 1000 }); return (Date.now() - t0) / 1000; } catch (e) { return -1; } };
const crit = { pattern: '1 and 2', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA R2W2 UI' }, { field: 'phone', operator: 'is_not_empty', value: null }] };
// NDC-1197 actions menu
await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' }); await firstRow(45);
await page.click('[aria-label="Module actions"], [title="Module actions"]'); await wait(1200);
out.actionsMenu = await page.$$eval('[role=menuitem]', es => es.filter(e => e.offsetParent).map(e => e.innerText.trim().replace(/\s+/g, ' ')));
await page.screenshot({ path: RAW + 'actions-menu.png' }); await page.keyboard.press('Escape');
// NDC-2280 long view name
const longName = 'QA R2W2 ' + 'Long view name to check the manage views table '.repeat(3).slice(0, 110);
const lv = await api('POST', `/modules/${LEADS}/views`, { name: longName, kind: 'list', layout_id: LAY, visibility: 'private', settings: { columns: ['first_name'], sort: null, criteria: crit, related_criteria: [] } });
out.longViewCreate = lv.s; const longId = lv.j && lv.j.data && lv.j.data.id;
await page.goto(H + `/modules/${LEADS}/views/manage`, { waitUntil: 'domcontentloaded' }); await wait(6000);
out.manageHasLong = (await page.innerText('body')).includes('QA R2W2 Long');
await page.screenshot({ path: RAW + 'manage-views-long-name.png', fullPage: false });
// NDC-2098 deleted view id in the URL
const v = await api('POST', `/modules/${LEADS}/views`, { name: 'QA R2W2 UI deleted view', kind: 'list', layout_id: LAY, visibility: 'private', settings: { columns: ['first_name'], sort: null, criteria: crit, related_criteria: [] } });
const vid = v.j.data.id;
await page.goto(H + `/modules/${LEADS}?view=${vid}`, { waitUntil: 'domcontentloaded' }); await firstRow(45); await wait(2000);
out.viewOpened = (await page.innerText('main')).includes('QA R2W2 UI deleted view');
out.deleteView = (await api('DELETE', `/modules/${LEADS}/views/${vid}`)).s;
await page.goto(H + `/modules/${LEADS}?view=${vid}`, { waitUntil: 'domcontentloaded' }); out.afterDeleteLoad = await firstRow(60); await wait(2500);
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
out.afterDelete = { showsDeleted: t.includes('QA R2W2 UI deleted view'), allLeads: /All Leads/.test(t), text: t.slice(0, 200) };
await page.screenshot({ path: RAW + 'deleted-view-url.png' });
out.longId = longId;
if (longId) out.deleteLong = (await api('DELETE', `/modules/${LEADS}/views/${longId}`)).s;
