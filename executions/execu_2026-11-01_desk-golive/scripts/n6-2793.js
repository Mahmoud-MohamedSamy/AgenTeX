const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/settings/automation/workflow-rules/171841cb-fa2d-4895-9505-7fca222a720b', { waitUntil: 'commit' }).catch(() => {});
o.hits = await page.evaluate(async () => { const s = [...document.scripts].map(x => x.src).filter(Boolean); const out = []; for (const u of s) { try { const t = await (await fetch(u)).text(); for (const re of [/.{0,140}(alsoOnCreate|runOnCreate|includeCreate|onCreateToo|fireOnCreate|also run|Also run|when created)[^;]{0,140}/g, /SpecificFieldChanged.{0,200}/g]) { const m = t.match(re); if (m) out.push(...m.slice(0, 3)); } } catch (e) {} } return out.slice(0, 8); });
return JSON.stringify(o);
