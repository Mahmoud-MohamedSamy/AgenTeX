await getAgent(); const r = await api('POST', `/agents/${AGENT}/deploy`, {}); const b = await getAgent();
ledger(`B-0x: deploy attempt with ${process.env.MODE} draft → ${r.s} ${r.j?.error?.code || ''} live v${b.deployed_version_no}`);
return { mode: process.env.MODE, deploy: r.s, err: r.j?.error?.code, msg: (r.j?.error?.message || '').slice(0, 250), live: b.deployed_version_no, undeployed: b.has_undeployed_changes };
