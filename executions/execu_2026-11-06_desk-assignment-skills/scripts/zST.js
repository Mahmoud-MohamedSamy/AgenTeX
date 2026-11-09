async (page) => {
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/haytham-mohamed/setup#setup/automation/1475109000000006907/skilltypes', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  let t = '';
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(2000); t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); if (/SKILL TYPES/i.test(t) && /Add Skill Type/.test(t)) break; }
  await page.waitForTimeout(2000);
  const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-06_desk-assignment-skills/screenshots/zoho-skill-types-2026-11-08.png';
  await page.screenshot({ path: P });
  const bb = async (re) => { const l = page.getByText(re).first(); return (await l.count()) ? await l.boundingBox() : null; };
  return { url: page.url().split('#')[1], hasTypes: /SKILL TYPES/i.test(t), snippet: (t.match(/Skills .{0,300}/) || [''])[0], dept: await bb(/^Haytham Mohamed$/), tab: await bb(/^SKILL TYPES$/i), hdr: await bb(/^Skills$/) };
}
