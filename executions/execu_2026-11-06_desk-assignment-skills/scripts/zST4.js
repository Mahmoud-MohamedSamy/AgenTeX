async (page) => {
  await page.waitForTimeout(2000);
  const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-06_desk-assignment-skills/screenshots/zoho-skill-types-2026-11-08.png';
  await page.screenshot({ path: P });
  const bb = async (re) => { const l = page.getByText(re); const n = await l.count(); const o = []; for (let i = 0; i < n; i++) { const b = await l.nth(i).boundingBox(); if (b) o.push(b); } return o; };
  return { dept: await bb(/^Haytham Mohamed$/), tab: await bb(/^skill types$/i), skillsTab: await bb(/^skills$/i), add: await bb(/^Add Skill Type$/), assoc: await bb(/^associated skills$/i) };
}
