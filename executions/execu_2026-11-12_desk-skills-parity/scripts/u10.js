async (page) => { await page.goto('https://staging-desk.taviportal.com/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/3ba7488d-1c85-4691-aaa1-d6b286a61b8d', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(10000);
 await page.screenshot({ path: 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/tavi-E1-ticket.png' });
 const t = await page.innerText('body'); const i=t.indexOf('Ticket Owner'); const j=t.indexOf('Skills'); return [t.slice(i, i+80), t.slice(j, j+80)]; }
