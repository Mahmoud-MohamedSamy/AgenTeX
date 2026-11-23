const bulk = JSON.parse(fs.readFileSync(RUN + '/out/bulk1.json', 'utf8')); const a = JSON.parse(fs.readFileSync(RUN + '/out/rt6.json', 'utf8')); const c = JSON.parse(fs.readFileSync(RUN + '/out/rt6c.json', 'utf8'));
const out = {}; let r = 0, t = 0;
for (const id of [...bulk, ...Object.values(a.R), ...Object.values(c.R)].filter(Boolean)) if ((await api('DELETE', '/workflow/rules/' + id)).s < 300) r++;
for (const x of (await allRules()).filter(x => /^QA WF /.test(x.name))) if ((await api('DELETE', '/workflow/rules/' + x.id)).s < 300) r++;
for (const id of [...Object.values(a.TK), ...Object.values(c.TK)].filter(Boolean)) if ((await api('DELETE', `/modules/${T}/records/${id}`)).s < 300) t++;
out.skill = (await api('DELETE', '/desk/skills/' + a.SK)).s; out.skillType = (await api('DELETE', '/desk/skill-types/' + a.ST)).s;
out.rules = r; out.tickets = t; await sleep(10000); let p = 0;
for (let k = 0; k < 12; k++) { const it = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!it.length) break; for (let j = 0; j < it.length; j += 50) { const d = await api('POST', '/audit/recycle-bin/delete', { ids: it.slice(j, j + 50).map(i => i.id) }); if (d.s < 300) p += Math.min(50, it.length - j); } await sleep(3000); }
out.purged = p; out.qaRulesLeft = (await allRules()).filter(x => /^QA WF /.test(x.name)).length; out.totalRules = (await allRules()).length;
out.binLeft = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify([i.record_label]))).length;
out.skillsLeft = ((d => d?.skills || arr(d))((await api('GET', '/desk/skills?department_id=' + DEPT2)).j?.data)).filter(s => /QA WF/.test(s.name)).length;
ledger('CLEANUP rerun ' + JSON.stringify(out)); return out;
