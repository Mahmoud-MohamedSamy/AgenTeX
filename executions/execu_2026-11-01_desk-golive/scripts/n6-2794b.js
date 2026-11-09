const o = {};
o.hits = await page.evaluate(async () => { const s = [...document.scripts].map(x => x.src).filter(Boolean); const out = [];
  for (const u of s) { try { const t = await (await fetch(u)).text(); for (const re of [/.{0,200}loses its owner.{0,300}/g, /.{0,200}only one OwnerAssignment.{0,100}/g, /.{0,120}SpecificUser.{0,240}/g]) { const m = t.match(re); if (m) out.push(...m.slice(0, 2)); } } catch (e) {} } return { n: s.length, out: out.slice(0, 8) }; });
return JSON.stringify(o);
