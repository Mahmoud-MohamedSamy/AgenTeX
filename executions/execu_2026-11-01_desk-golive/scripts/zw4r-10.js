async (page) => {
  const out = { links: [] };
  for (const f of page.frames()) { try { const ls = await f.locator('a').evaluateAll(es => es.map(e => e.href).filter(h => /feedback|happiness|rating|survey/i.test(h))); out.links.push(...ls); } catch (e) {} }
  out.n = out.links.length; out.shape = out.links.map(l => l.replace(/([?&=\/])[A-Za-z0-9_-]{16,}/g, '$1<id>'));

  return out;
}
