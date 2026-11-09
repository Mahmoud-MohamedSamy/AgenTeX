const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const before = (await api('GET', `/modules/${L}/records/${REC}/attachments`)).j.data; const ui = before.find(x => x.file_name === 'qa-r2sc-ui.pdf');
await page.locator('[role=dialog] button:has-text("Remove"), [role=alertdialog] button:has-text("Remove")').last().click().catch(async () => {
  await page.locator('li:has-text("qa-r2sc-ui.pdf") button[aria-label="Delete"], li:has-text("qa-r2sc-ui.pdf") button[title="Delete"]').first().click(); await sleep(1500);
  await page.locator('[role=dialog] button:has-text("Remove"), [role=alertdialog] button:has-text("Remove")').last().click(); });
await sleep(4000);
out.toasts = await page.$$eval('[data-sonner-toast], [role=status]', es => es.map(e => e.innerText.trim()).filter(Boolean));
out.stillListedUi = (await page.innerText('main')).includes('qa-r2sc-ui.pdf');
const after = (await api('GET', `/modules/${L}/records/${REC}/attachments`)).j.data;
out.stillListedApi = after.some(x => x.file_name === 'qa-r2sc-ui.pdf'); out.count = [before.length, after.length];
const d = await api('POST', `/files/${ui.file_id}/download`, { file_id: ui.file_id, vouching_app_key: 'crm' });
out.fileStillDownloadable = d.s + (d.j && d.j.data ? ' fetch ' + await page.evaluate(async u => (await fetch(u)).status, d.j.data.download_url) : ' ' + d.t.slice(0, 150));
// DELETE through API of another one + 404 for a second delete
const one = after.find(x => x.file_name === 'qa-r2sc-random.pdf');
out.apiDel = (await api('DELETE', `/modules/${L}/records/${REC}/attachments/${one.id}`)).s;
out.apiDel2 = (await api('DELETE', `/modules/${L}/records/${REC}/attachments/${one.id}`)).s;
const fd = await api('GET', `/timeline/records/leads/${REC}/feed`);
out.feedTypes = (fd.j.data.data || []).slice(0, 5).map(e => e.entry_type);
