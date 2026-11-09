const o = {}; const keep = ['Open', 'On Hold', 'Escalated', 'Closed', 'QA NDC Pending'];
const sec = page.locator('div').filter({ has: page.getByText('Statuses by department and layout', { exact: true }) }).last();
const labels = sec.locator('label').filter({ has: page.locator('input[type=checkbox]') });
const n = await labels.count(); o.n = n; let un = 0;
for (let i = 0; i < n; i++) { const l = labels.nth(i); const name = (await l.innerText()).trim(); const cb = l.locator('input[type=checkbox]'); if (!keep.includes(name) && await cb.isChecked()) { await l.click(); un++; } }
o.unchecked = un; await sleep(800);
const t = (await txt()).replace(/\s+/g, ' '); const i = t.lastIndexOf('QA NDC Closed Duplicated'); o.tail = t.slice(i, i + 500);
o.shot = await shot('rt/2797-picked');
return JSON.stringify(o);
