async (page) => { const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
  await page.goto('https://staging-desk.taviportal.com/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000);
  await page.evaluate(() => { const e = [...document.querySelectorAll('button, span, div')].find(x => x.childElementCount === 0 && x.offsetParent && x.textContent.trim() === 'QA SK12 S1'); if (e) e.scrollIntoView({ block: 'center' }); });
  await page.waitForTimeout(1000); await page.screenshot({ path: S + 'tavi-create-ticket-deleted-chips.png' });
  return page.evaluate(() => { const els = [...document.querySelectorAll('button, span, div')].filter(x => x.childElementCount === 0 && x.offsetParent && /^QA SK1[23]/.test(x.textContent.trim()));
    const r = els.map(e => { const b = e.getBoundingClientRect(); return [e.textContent.trim().slice(0, 20), Math.round(b.x), Math.round(b.y), Math.round(b.right), Math.round(b.bottom)]; });
    const dep = [...document.querySelectorAll('*')].find(x => x.childElementCount === 0 && x.offsetParent && x.textContent.trim() === 'Department'); const db = dep?.getBoundingClientRect();
    return { n12: r.filter(x => /^QA SK12/.test(x[0])).length, n13: r.filter(x => /^QA SK13/.test(x[0])).length, dept: db ? [Math.round(db.x), Math.round(db.y)] : null, vis: r.filter(x => x[2] > 0 && x[2] < 900) }; }); }
