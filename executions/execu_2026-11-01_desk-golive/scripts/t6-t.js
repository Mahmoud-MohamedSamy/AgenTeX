const T3 = 'f0de42fe-d7da-46a0-b75e-2b8abeceee37';
await go('/views/all/tickets/' + T3, 9000); await clickItem('Clone'); await sleep(3500); out.url3 = page.url().replace(H, '').slice(0, 200);
out.status3 = (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Status.{0,40}/)?.[0];
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(6000);
out.clone3 = { toast: await toasts(), url: page.url().replace(H, '').slice(0, 120), net: flt().filter(x => /POST|PUT/.test(x)).slice(0, 3) }; await shot('tm/tavi-clone3');
if (/records\/new/.test(page.url())) {
  const st = page.locator('label,div').filter({ hasText: /^\*?\s*Status$/ }).first(); const sel = page.getByText('Select', { exact: true }).first(); await sel.click(); await sleep(1000);
  await page.getByRole('option', { name: 'Open', exact: true }).first().click().catch(e => out.optErr = e.message.slice(0, 80)); await sleep(800);
  await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(6000);
  out.clone3b = { toast: await toasts(), url: page.url().replace(H, '').slice(0, 120), net: flt().filter(x => /POST|PUT/.test(x)).slice(0, 3) }; await shot('tm/tavi-clone3b');
}
const cl = [...(await findT('QA GL TM menu 3')), ...(await findT('QA GL TM menu 1'))].filter(x => /Clone/.test(x.subject || '')); for (const c of cl) CREATED.push({ kind: 'ticket', id: c.id, name: c.subject }); out.clones = cl.map(c => c.id + ' ' + c.subject + ' #' + c.ticket_number + ' ' + c.status + ' ' + c.email + ' contact ' + c.contact_id);
return fin({ out });
