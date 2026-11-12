async (page, ctx) => {
  const p = await zdPage(ctx); const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  const urls = ['https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/customization/layoutrules', 'https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/layoutrules/tickets'];
  const out = [];
  for (const u of urls) { await p.goto(u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000); const t = (await p.innerText('body')).replace(/\s+/g, ' '); out.push(p.url().replace(/\?.*/, '') + ' :: ' + (t.match(/.{0,80}Layout Rule.{0,200}/)?.[0] || t.slice(0, 200))); if (/New Layout Rule|Create Layout Rule|Layout Rules/i.test(t)) { await p.screenshot({ path: EVd + 'zoho-desk-lr-list.png' }); break; } }
  return out;
}
