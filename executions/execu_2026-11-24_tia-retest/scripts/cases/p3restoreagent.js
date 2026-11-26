const B = JSON.parse(fs.readFileSync(RUN + '/out/p3-baseline.json', 'utf8')); const a = await getAgent(); const o = {};
const put = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: B.agent.def, expected_updated_at: a.updated_at }); const dep = await api('POST', `/agents/${a.id}/deploy`, {}); o.restore = put.s + '/' + dep.s;
const docs = arr((await api('GET', '/agents/kb/documents')).j?.data).filter(d => /qa-tia-p3/i.test(d.name)); o.del = []; for (const d of docs) o.del.push((await api('DELETE', `/agents/kb/documents/${d.id}`)).s);
const a2 = await getAgent(); o.same = JSON.stringify(a2.draft_definition) === JSON.stringify(B.agent.def); o.ver = a2.deployed_version_no; o.undeployed = a2.has_undeployed_changes; o.docsLeft = arr((await api('GET', '/agents/kb/documents')).j?.data).filter(d => /qa-tia-p3/i.test(d.name)).length;
ledger('P3: Tia restored ' + JSON.stringify(o)); return o;
