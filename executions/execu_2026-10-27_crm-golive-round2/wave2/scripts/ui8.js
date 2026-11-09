const H = 'https://staging-crm.taviportal.com', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288', B = H + '/api/v1';
const wait = ms => page.waitForTimeout(ms);
const ck = (await page.context().cookies()).find(c => c.name === 'aw_staging_access_token');
const HD = { authorization: 'Bearer ' + ck.value, 'x-app-key': 'crm', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'content-type': 'application/json' };
const api = async (m, p, body) => { const r = await page.context().request.fetch(B + p, { method: m, headers: HD, data: body ? JSON.stringify(body) : undefined, failOnStatusCode: false }); let j = null; try { j = await r.json(); } catch (e) {} return { s: r.status(), j }; };
const crit = { pattern: '1 and 2', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA R2W2 UI' }, { field: 'phone', operator: 'is_not_empty', value: null }] };
// NDC-2280 long view name, wait for the table
const longName = 'QA R2W2 ' + 'Long view name to check the manage views table '.repeat(3).slice(0, 110);
const lv = await api('POST', `/modules/${LEADS}/views`, { name: longName, kind: 'list', layout_id: LAY, visibility: 'private', settings: { columns: ['first_name'], sort: null, criteria: crit, related_criteria: [] } });
const longId = lv.j.data.id;
await page.goto(H + `/modules/${LEADS}/views/manage`, { waitUntil: 'domcontentloaded' });
const t0 = Date.now(); try { await page.waitForFunction(() => document.body.innerText.includes('QA R2W2 Long'), null, { timeout: 60000 }); } catch (e) {}
out.manageLoadSeconds = (Date.now() - t0) / 1000; out.manageHasLong = (await page.innerText('body')).includes('QA R2W2 Long');
const row = page.locator('tr', { hasText: 'QA R2W2 Long' }).first();
if (await row.count()) { await row.scrollIntoViewIfNeeded(); const cells = await row.locator('td').evaluateAll(tds => tds.map(td => { const r = td.getBoundingClientRect(); return { w: Math.round(r.width), sw: td.scrollWidth, cw: td.clientWidth, text: td.innerText.slice(0, 40) }; })); out.longRowCells = cells; await row.screenshot({ path: RAW + 'manage-views-long-row.png' }); }
await page.screenshot({ path: RAW + 'manage-views-long-name.png' });
out.deleteLong = (await api('DELETE', `/modules/${LEADS}/views/${longId}`)).s;
// NDC-1823 conversion fields
const s = v => ({ kind: 'string', value: v });
const l = await api('POST', `/modules/${LEADS}/records`, { layout_id: LAY, data: [{ field: 'first_name', value: s('QA R2W2 UI conv') }, { field: 'phone', value: s('01016600001') }, { field: 'single_line_3_9', value: s('QA R2W2') }] });
out.convLead = l.s; const lid = l.j && l.j.data && l.j.data.id; out.convLeadId = lid;
await page.goto(H + `/modules/${LEADS}/records/${lid}/convert`, { waitUntil: 'domcontentloaded' }); await wait(9000);
out.convFields = await page.evaluate(() => { const res = {}; for (const lab of ['Probability (%)', 'Expected Revenue', 'Lead Conversion Time', 'Sales Cycle Duration', 'Overall Sales Duration']) { const el = [...document.querySelectorAll('label')].find(x => x.innerText.trim().replace(/\s*\*$/, '') === lab); if (!el) { res[lab] = 'not shown'; continue; } const c = el.htmlFor ? document.getElementById(el.htmlFor) : el.parentElement.querySelector('input,textarea'); res[lab] = c ? (c.disabled || c.readOnly ? 'read-only' : 'editable') : 'no input'; } return res; });
await page.screenshot({ path: RAW + 'convert-page.png' });
// NDC-1819 work queue
await page.goto(H + '/work-queue', { waitUntil: 'domcontentloaded' }); await wait(8000);
out.workQueue = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 400);
await page.screenshot({ path: RAW + 'work-queue.png' });
