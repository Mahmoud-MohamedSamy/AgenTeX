const out = {};
const open = async () => {
  await page.goto(H + '/settings/blueprints/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/8f3caaf1-2386-4a5d-bdb7-4f8bf6479649', { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 40; i++) { await sleep(2000); if (/NeedsAnalysis/i.test(await text())) break; }
  await page.getByText(/NeedsAnalysisToProposal/).first().click(); await sleep(2500);
  await page.getByRole('tab', { name: /Transition/i }).first().click().catch(() => {}); await sleep(1200);
  await page.getByText('After', { exact: true }).first().click(); await sleep(2000);
};
const dumpCard = async title => page.evaluate(title => {
  const hs = [...document.querySelectorAll('div,span,p,h3,h4')].filter(e => e.childElementCount === 0 && e.textContent.trim() === title && e.getBoundingClientRect().x > 1150);
  const h = hs[hs.length - 1]; if (!h) return { err: 'no heading' };
  let c = h; for (let i = 0; i < 8 && c; i++) { c = c.parentElement; if (c && c.querySelectorAll('select,input,textarea,[role=combobox]').length > 2) break; }
  const ctrls = [...c.querySelectorAll('select,input,textarea,button[aria-haspopup],[role=combobox]')].map(el => { let lab = ''; let p = el; for (let i = 0; i < 4 && p && !lab; i++) { p = p.parentElement; const l = p && p.querySelector('label'); if (l) lab = l.innerText.trim(); } return { lab: lab.split('\n')[0].slice(0, 30), tag: el.tagName, type: el.type || '', ph: el.getAttribute('placeholder') || '', v: el.tagName === 'SELECT' ? (el.options[el.selectedIndex] || {}).text : (el.value || el.innerText || '').slice(0, 40), opts: el.tagName === 'SELECT' ? [...el.options].map(o => o.text).slice(0, 14).join(' | ') : undefined }; });
  return { text: c.innerText.replace(/\s+/g, ' ').slice(0, 900), ctrls };
}, title);
for (const [btn, title, shotName] of [['Create task', 'Create task', '2729-1-crm-task'], ['Meeting', 'Meeting', '2729-2-crm-meeting'], ['Call', 'Call', '2729-3-crm-call'], ['Create record', 'Create record', '2729-4-crm-create-record']]) {
  await open();
  await page.locator('button', { hasText: new RegExp('^\s*' + btn + '\s*$') }).first().click(); await sleep(2500);
  out[title] = await dumpCard(title);
  const h = page.getByText(title, { exact: true }).last(); await h.scrollIntoViewIfNeeded(); await sleep(600); await shot(shotName + '-top.png');
  await page.mouse.move(1380, 600); await page.mouse.wheel(0, 450); await sleep(800); await shot(shotName + '-bottom.png');
}
return out;
