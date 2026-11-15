async (page) => {
  const out = { frames: page.frames().length, found: [] };
  for (const f of page.frames()) { try { const h = await f.evaluate(() => { const i = document.body ? document.body.innerHTML : ''; const k = i.search(/rate our customer service/i); return k >= 0 ? i.slice(Math.max(0, k - 200), k + 1500) : ''; }); if (h) out.found.push(h.replace(/([?&=\/])[A-Za-z0-9_-]{20,}/g, '$1<id>').slice(0, 1600)); } catch (e) {} }
  return out;
}
