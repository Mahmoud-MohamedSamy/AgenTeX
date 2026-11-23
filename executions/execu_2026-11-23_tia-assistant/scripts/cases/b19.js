const item = JSON.parse(fs.readFileSync(RUN + '/out/b18-recycle.json','utf8')).item;
const r = await api('POST', '/audit/recycle-bin/restore', { ids: [item.id] });
await sleep(5000);
const a = await getAgent();
return { restore: r.s, err: r.j?.error, data: JSON.stringify(r.j?.data||'').slice(0,300), agent: a && { status: a.status, v: a.deployed_version_no, latest: a.latest_version_no, tools: a.draft_definition?.tool_keys?.length, same: JSON.stringify(a.draft_definition) === JSON.stringify(BASEDEF.draft_definition) } };
