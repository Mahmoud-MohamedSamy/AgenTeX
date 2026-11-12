async (page) => {
  const dialogs = []; page.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(()=>{}); });
  await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/new?layout=3847cbd4-508c-4402-9602-e63a72a0f1d7', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(9000);
  await page.screenshot({ path: 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/crm-create-1.png', fullPage: true });
  const labels = await page.evaluate(() => [...document.querySelectorAll('label, [data-field], [data-testid]')].map(e => (e.getAttribute('data-field')||e.getAttribute('data-testid')||'') + '|' + (e.innerText||'').trim().slice(0,40)).filter(s => /QA LR|qa_lr/.test(s)).slice(0,40));
  const el = await page.evaluate(() => { const l = [...document.querySelectorAll('label')].find(x => /QA LR1112 type/.test(x.innerText)); if (!l) return null; let p = l; for (let i=0;i<4;i++) p = p.parentElement; return p.outerHTML.slice(0, 2500); });
  return { url: page.url(), labels, el, dialogs };
}
