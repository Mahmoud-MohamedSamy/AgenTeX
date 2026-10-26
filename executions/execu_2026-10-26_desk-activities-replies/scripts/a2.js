try {
// ACT batch 2: subject max (API bisect), M2 retest, then UI task life cycle on a UI-created task
// (subject max and M2b done in run 1 of a2)
// UI: add task via the drawer
const toast = async () => (await page.$$eval('[data-sonner-toast]', ts => ts.map(t => t.innerText.replace(/\s+/g, ' ')).join(' | ')).catch(() => ''));
await go('/activities', 6000); for (let i = 0; i < 30 && !(await txt()).includes('Total Count'); i++) await sleep(1000);
await page.getByRole('button', { name: 'Add Activity' }).first().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Task/ }).first().click(); await sleep(3000);
const dlg = page.locator('[role=dialog]').last();
await dlg.getByPlaceholder('Type or pick a subject').fill('QA ACT UI task'); await sleep(500); await page.keyboard.press('Escape').catch(() => {}); await sleep(300); if (!(await dlg.isVisible())) { await page.getByRole('button', { name: 'Add Activity' }).first().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Task/ }).first().click(); await sleep(3000); await page.locator('[role=dialog]').last().getByPlaceholder('Type or pick a subject').fill('QA ACT UI task'); await sleep(500); }
await dlg.getByRole('button', { name: /^Save$/ }).click(); await sleep(3500);
rec('ACT-C1-ui', 'INFO', 'toast: ' + await toast());
// find it
const L = await api('GET', `/modules/${M.tasks}/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc`);
const list = ((L.j && L.j.data && (L.j.data.records || L.j.data.items || L.j.data)) || []).map(fl);
const ut = list.find(x => x.subject === 'QA ACT UI task');
if (!ut) return fin({ err: 'ui task not found', subjects: list.map(x => x.subject).slice(0, 5) });
CREATED.push({ k: 'tasks', id: ut.id, tag: 'C1-ui' });
rec('ACT-C1-ui-defaults', 'INFO', `status=${ut.status} priority=${ut.priority} owner=${ut.owner ? 'set' : 'empty'} department=${ut.department} created_by=${ut.created_by}`);
// detail page
await go(`/modules/${M.tasks}/records/${ut.id}`, 9000);
const d0 = await txt(); rec('ACT-C19', /Created By Unknown user/.test(d0) ? 'FAIL' : 'PASS', (d0.match(/Created By[^\n]*/) || [''])[0] + ' / ' + (d0.match(/Modified By\n[^\n]*/) || [''])[0].replace('\n', ' '));
await page.getByRole('button', { name: 'Mark as Complete' }).click(); await sleep(3000);
const afterC = (await recOf('tasks', ut.id)).o; const d1 = await txt();
rec('ACT-D2', afterC.status === 'Completed' && afterC.completed_time ? 'PASS' : 'FAIL', `toast=${await toast()} status=${afterC.status} completed_time=${afterC.completed_time} reopenBtn=${/Reopen Task/.test(d1)}`);
await page.getByRole('button', { name: 'Reopen Task' }).click().catch(e => rec('ACT-D4', 'BLOCKED', String(e.message).slice(0, 80))); await sleep(3000);
const afterR = (await recOf('tasks', ut.id)).o;
rec('ACT-D4', afterR.status === 'Not Started' ? 'PASS' : 'FAIL', `after reopen status=${afterR.status} completed_time=${afterR.completed_time} (Zoho: Not Started)`);
// priority label
await patch('tasks', ut.id, { priority: 'highest' }); await go(`/modules/${M.tasks}/records/${ut.id}`, 8000);
const d2 = await txt(); const pr = (d2.match(/Priority\n([^\n]+)/) || [])[1];
rec('ACT-D10', pr === 'Highest' ? 'PASS' : 'FAIL', 'detail priority text = ' + pr, { shot: pr !== 'Highest' ? await shot('ACT-D10-tavi') : null });
// comments add/edit/delete
const box = page.getByPlaceholder('Write a comment…'); await box.click(); await box.fill('QA ACT comment 1'); await page.getByRole('button', { name: 'Comment', exact: true }).click(); await sleep(2500);
const ca = await toast();
let edit = 'n/a', del = 'n/a';
try { await page.getByRole('button', { name: 'Comment actions' }).first().click({ timeout: 5000 }); await sleep(800); await page.getByRole('menuitem', { name: 'Edit' }).click(); await sleep(800); const ed = page.getByRole('textbox', { name: 'Edit comment' }); await ed.fill('QA ACT comment 1 edited'); await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(2000); edit = await toast();
  await page.getByRole('button', { name: 'Comment actions' }).first().click(); await sleep(800); await page.getByRole('menuitem', { name: 'Delete' }).click(); await sleep(800); await page.getByRole('button', { name: /^Delete$/ }).last().click(); await sleep(2000); del = await toast(); } catch (e) { edit = edit + ' ERR ' + String(e.message).slice(0, 80); }
rec('ACT-I2', /updated/i.test(edit) && /deleted/i.test(del) ? 'PASS' : 'FAIL', `add=${ca} | edit=${edit} | delete=${del}`);
return fin({ uiTask: ut.id });
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); return fin(); }
