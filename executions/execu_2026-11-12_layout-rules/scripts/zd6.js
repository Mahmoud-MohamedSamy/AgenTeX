async (page, ctx) => {
  const p = await zdPage(ctx); const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  await p.screenshot({ path: EVd + 'zoho-desk-setup.png' });
  const hits = await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && /layout rule/i.test(e.textContent || '')).map(e => { const r = e.getBoundingClientRect(); return e.tagName + '|' + e.textContent.trim().slice(0, 40) + '|' + Math.round(r.x) + ',' + Math.round(r.y) + ',' + Math.round(r.width); }).slice(0, 10));
  return { url: p.url(), hits };
}
