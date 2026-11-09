const o = {};
o.hits = await page.evaluate(async () => { const s = [...document.scripts].map(x => x.src).filter(Boolean); const out = []; for (const u of s) { try { const t = await (await fetch(u)).text(); for (const re of [/.{0,160}(TeamWithAgent|TEAM_WITH_AGENT|teamWithAgent|Team with agent|ownerTeamId|teamAndUser|TeamAndUser)[^;]{0,160}/g, /ownerTargetKind.{0,200}/g]) { const m = t.match(re); if (m) out.push(...m.slice(0, 3)); } } catch (e) {} } return out.slice(0, 8); });
return JSON.stringify(o);
