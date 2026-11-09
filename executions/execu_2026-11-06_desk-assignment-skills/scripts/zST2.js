async (page) => {
  await page.evaluate(() => { location.hash = '#setup/automation/1475109000000006907/skilltypes'; });
  let t = '';
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(2000); t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); if (/Add Skill Type/.test(t)) break; }
  await page.waitForTimeout(2500);
  const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-06_desk-assignment-skills/screenshots/zoho-skill-types-2026-11-08.png';
  await page.screenshot({ path: P });
  const bb = async (re) => { const l = page.getByText(re); const n = await l.count(); const out = []; for (let i = 0; i < n; i++) { const b = await l.nth(i).boundingBox(); if (b) out.push(b); } return out; };
  return { url: page.url().split('#')[1], ok: /Add Skill Type/.test(t), dept: await bb(/^Haytham Mohamed$/), tab: await bb(/^skill types$/i), add: await bb(/^Add Skill Type$/), assoc: await bb(/^associated skills$/i) };
}
