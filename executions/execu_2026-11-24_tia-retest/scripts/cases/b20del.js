const a = await getAgent(); fs.writeFileSync(RUN + '/out/b20-agent-before.json', JSON.stringify(a, null, 1));
const r = await api('DELETE', `/agents/${AGENT}`); ledger(`B-20: Tia ${AGENT} deleted (${r.s}) — restore from Recycle Bin right after`);
const st = (await api('GET', '/agents/tia/status')).j?.data; return { del: r.s, err: r.j?.error?.code, id: AGENT, v: a.deployed_version_no, status: st };
