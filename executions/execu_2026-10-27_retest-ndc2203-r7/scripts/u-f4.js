// F4: History of tickets whose rule shared it (B07 #598), posted a public comment (B01b #594), marked spam (B06 #597). Nothing saved.
const out = {};
const openHist = async () => { for (let i = 0; i < 4; i++) { const h = page.getByText(/^History$/i).first(); if (await h.isVisible().catch(() => false)) { await h.click(); await sleep(4000); return true; } const nx = page.locator('button:right-of(:text("PARENT-CHILD"))').first(); await nx.click().catch(() => {}); await sleep(700); } return false; };
for (const [k, id] of [['b07', 'e39023b0-4809-4542-872d-8e00c58f1cbb'], ['b01b', 'c0593438-33fd-4dda-97db-6fb24bafc890'], ['b06', 'e155afa5-ff41-467c-9816-dd3fa29955e3']]) {
  await go('/views/all/tickets/' + id, 12000);
  const ok = await openHist(); await shot('f4-history-' + k);
  const all = (await txt()).split('\n'); const i0 = all.findIndex(l => /^History$/i.test(l.trim()));
  out[k] = { ok, lines: all.slice(Math.max(0, i0)).filter(l => /workflow|rule|System|comment|Share|spam|layout|reply/i.test(l)).slice(0, 18) };
}
return done(out);
