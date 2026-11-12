async (page) => { const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
  await page.goto('https://staging-desk.taviportal.com/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/f789bc25-1f7a-456b-ac0c-4dedc8254f71', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000);
  await page.evaluate(() => { const e = [...document.querySelectorAll('*')].find(x => x.childElementCount === 0 && x.textContent.trim() === 'Skills' && x.offsetParent); if (e) e.scrollIntoView({ block: 'center' }); });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: S + 'tavi-3176-deleted-skill.png' });
  await page.goto('https://staging-desk.taviportal.com/settings/automation/workflow-rules/11577372-a189-4557-9139-8fd080a15331', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000); await page.screenshot({ path: S + 'tavi-wf-rule-open.png' });
  return page.url(); }
