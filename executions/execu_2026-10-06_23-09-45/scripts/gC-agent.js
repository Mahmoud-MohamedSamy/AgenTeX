// Agent (Desk Agent, member of QA MF Dept): E2E-2 on QA MF Open with layout QA MF L-Agent; C4 view of department records.
const DM = 'e8845f1d-1153-4c9c-b3a8-a74b08e078dc', OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c', LAG = '2765f377-5030-4512-8c29-43b133395d11', LADM = '5d6fb69e-f710-4e3d-813c-d610f46073d4';
await step('E2E-2', async () => {
  const lays = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data).map(l => l.name);
  await go(`/modules/${OPEN}`, 8000); await page.mouse.click(678, 28); await sleep(1200); await page.getByText('QA MF Open1', { exact: true }).last().click(); await sleep(4000);
  const t0 = (await txt()); const chooser = /QA MF L-Agent|Default|Select layout|Layout/.test(t0.slice(0, 3000));
  const s0 = await shot('E2E-2-agent-form');
  // pick a layout if there is a chooser
  const lc = page.getByText('QA MF L-Agent', { exact: true }); if (await lc.count()) { await lc.first().click().catch(() => { }); await sleep(2000); }
  const sec = await page.getByText('QA MF E2E section', { exact: true }).count(); const serialBefore = await page.getByText('QA MF e2e_serial', { exact: true }).count();
  rec('E2E-2.form', 'INFO', `agent sees layouts [${lays.join(', ')}]; create form shows a layout chooser=${chooser}; E2E section on form=${sec > 0}; serial visible before choosing Hardware=${serialBefore > 0}`, { shot: s0 });
  await page.keyboard.press('Escape');
  // API: the rules as the agent, with the L-Agent layout
  const noSerial = await mkRec(OPEN, { name: 'QA MF E2E hw no serial', qa_e2e_kind: 'Hardware' }, LAG);
  const withSerial = await mkRec(OPEN, { name: 'QA MF E2E hw serial', qa_e2e_kind: 'Hardware', qa_e2e_serial: 'SN-1' }, LAG);
  const sw = await mkRec(OPEN, { name: 'QA MF E2E sw', qa_e2e_kind: 'Software' }, LAG);
  const viaAdmin = await mkRec(OPEN, { name: 'QA MF E2E via admin layout' }, LADM);
  rec('E2E-2.api', 'INFO', `agent with L-Agent: Hardware without serial (REQUIRE rule) → ${noSerial.s} ${noSerial.err}; Hardware with serial → ${withSerial.s}; Software → ${sw.s}; with the owner-only layout → ${viaAdmin.s} ${viaAdmin.err}`);
});
await step('C4.agent', async () => {
  const l = arr((await api('GET', `/modules/${DM}/records?page_size=50`)).j.data).map(r => JSON.stringify(r).match(/QA MF dept rec [a-z]+/) || ['?']).map(x => x[0]);
  const c = await mkRec(DM, { name: 'QA MF dept rec agent' }); const g = c.id ? JSON.stringify((await api('GET', `/modules/${DM}/records/${c.id}`)).j.data).match(/"[a-zA-Z_]*[dD]epartment[a-zA-Z_]*":[^,]{0,60}/g) : null;
  await go(`/modules/${DM}`, 7000); const s = await shot('C4-agent-dept-module');
  rec('C4.agent', 'INFO', `agent (member of QA MF Dept) lists ${l.length} records: ${l.join(', ')}; agent create → ${c.s} ${c.err}; department keys ${JSON.stringify(g)}`, { shot: s });
});
return done();
