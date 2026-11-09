const out = {};
const openHist = async () => { for (let i = 0; i < 4; i++) { const h = page.getByText(/^History$/i).first(); if (await h.isVisible().catch(() => false)) { await h.click(); await sleep(4000); return true; } const nx = page.locator('button:right-of(:text("PARENT-CHILD"))').first(); await nx.click().catch(() => {}); await sleep(700); } return false; };
const box = async t => { const b = await page.getByText(t, { exact: false }).first().boundingBox().catch(() => null); return b && [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)]; };
for (const [k, id] of [['od653', '412fcd4a-5dd6-4e8a-9461-b33f5d7658fc'], ['status668', null]]) {
  let tid = id; if (!tid) { const r = await api('GET', `/modules/${T}/records?page=1&per_page=40&sort_by=created_at&sort_dir=desc`); tid = arr(r.j?.data).find(x => (x.data || []).some(d => d.field === 'subject' && /^QA WF X3status/.test(d.value?.value || '')))?.id; }
  await go('/views/all/tickets/' + tid, 12000); await openHist();
  await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop = e.scrollHeight; }));
  await sleep(800); await shot('i2-history-bottom-' + k);
  const ln = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); const i = ln.findIndex(l => /^Ticket History/.test(l));
  out[k] = { lines: ln.slice(i, i + 30).filter(l => !/ago|^\d/.test(l)), comment: await box('Comment added'), ran: await box('Workflow rule ran'), byRule: await box('by workflow rule') };
}
return done(out);
