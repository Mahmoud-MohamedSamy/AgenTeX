// prepended helper: zapi(method, path, body) runs inside the Zoho page using the captured CSRF token
async function zapi(page, m, p, b) {
  if (!globalThis.__ztok) { const h = r => { const v = r.headers()['x-zcsrf-token']; if (v) globalThis.__ztok = v; }; page.on('request', h); await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(10000); page.off('request', h); }
  return page.evaluate(async ([m, u, b, t]) => { const r = await fetch(u, { method: m, headers: { orgId: '944875504', 'X-ZCSRF-TOKEN': t, 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const x = await r.text(); let j; try { j = JSON.parse(x); } catch { j = x.slice(0, 400); } return { s: r.status, j }; }, [m, '/supportapi/zd/techsolutionsegypt/api/v1/' + p, b, globalThis.__ztok]);
}
