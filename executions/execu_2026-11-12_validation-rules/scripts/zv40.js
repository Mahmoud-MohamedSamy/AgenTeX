async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  const out = {};
  for (const u of ['tech/setup/validationrules/tickets', 'tech/setup/customization/validationrules']) {
    await d.goto('https://desk.zoho.com/agent/techsolutionsegypt/' + u, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await d.waitForTimeout(7000);
    const t = await d.innerText('body');
    out[u] = t.includes('not found') ? 'notfound' : t.slice(t.indexOf('Validation')).slice(0, 600);
    if (!t.includes('not found')) { await d.screenshot({ path: ev + 'zoho-desk-vr.png' }); out.url = d.url(); break; }
  }
  return out;
}
