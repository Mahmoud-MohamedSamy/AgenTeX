async (page) => { const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
  await page.goto('https://staging-desk.taviportal.com/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/045ffef3-5ba2-436b-950c-a4f776665fdd', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000); await page.screenshot({ path: S + 'tavi-h7-ticket.png' });
  return await page.evaluate(() => document.body.innerText.slice(0, 1500)); }
