const o = {};
o.hits = await page.evaluate(async () => { const s = [...document.scripts].map(x => x.src).filter(Boolean); const out = []; for (const u of s) { try { const t = await (await fetch(u)).text(); for (const re of [/.{0,160}rules per department.{0,160}/g, /.{0,120}(maxRulesPerDepartment|rulesPerDepartment|workflowRuleLimit|ruleLimit)[^,;]{0,120}/gi]) { const m = t.match(re); if (m) out.push(...m.slice(0, 4)); } } catch (e) {} } return out.slice(0, 10); });
return JSON.stringify(o);
