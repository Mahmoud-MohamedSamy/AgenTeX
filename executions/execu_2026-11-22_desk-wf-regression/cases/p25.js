const TASKS = 'd120a6c2-2596-4254-968b-a1bcd3a000bf', CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const has = async (m) => arr((await api('GET', `/modules/${m}/records?take=200`)).j?.data).filter(r => /QA WF/.test(JSON.stringify(r.data || []))).map(r => r.id);
const t = await has(TASKS); const c = await has(CM);
for (const id of t) await api('DELETE', `/modules/${TASKS}/records/${id}`);
return { tasksLeft: t.length, contactsLeft: c.length, rulesActive: (await allRules()).filter(r => r.isActive).map(r => r.name), qaRules: (await allRules()).filter(r => /^QA WF/.test(r.name)).length };
