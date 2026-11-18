async (page) => { const out = {};
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(2000); const t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); if (/Subject/.test(t)) break; }
  const t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); out.form = t.slice(0, 1500);
  out.inputs = await page.locator('input,textarea').evaluateAll(es => es.filter(e => e.value && e.getBoundingClientRect().width > 0).map(e => (e.getAttribute('aria-label') || e.name || e.placeholder || e.id) + '=' + e.value.slice(0, 60)));
  await page.screenshot({ path: '../evidence/zoho-tm/clone-form.png' }); return out; }
