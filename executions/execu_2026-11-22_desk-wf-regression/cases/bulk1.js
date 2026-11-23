// PF-03 / L-09: add 165 INACTIVE guarded QA rules (deleted right after the measurements).
const ids = []; let fail = 0;
for (let i = 0; i < 165; i++) { const r = await mkRule('PF bulk ' + String(i).padStart(3, '0'), { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'WF' })], { active: false, departmentIds: [i % 2 ? DEPT : DEPT2] }); if (r.id) ids.push(r.id); else { fail++; if (fail > 5) break; } }
fs.writeFileSync(RUN + '/out/bulk1.json', JSON.stringify(ids));
const all = await allRules(); const p = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=500`)).j?.data); const p2 = await api('GET', `/workflow/rules?moduleId=${T}&take=200&skip=200`);
return { created: ids.length, fail, total: all.length, take500returns: p.length, page2: arr(p2.j?.data).length, totalCountField: JSON.stringify(Object.keys(p2.j?.meta || {})) + ' ' + JSON.stringify(p2.j?.meta || null).slice(0, 120) };
