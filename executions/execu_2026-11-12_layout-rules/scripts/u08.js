async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/ids-crm.json', 'utf8'));
  await openRec(mid, ids.G4);
  const lab = page.getByText('QA LR1112 type', { exact: true }).first(); await lab.scrollIntoViewIfNeeded();
  const html = await lab.evaluate(e => { let p = e; for (let i = 0; i < 3; i++) p = p.parentElement; return p.outerHTML.slice(0, 1800); });
  return { html };
}
