const D = JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/data.json', 'utf8'));
const ids = [...Object.values(D.tk), ...Object.values(D.g), D.control]; const o = { n: ids.length, res: [] };
for (const id of ids) { const g = await api('o', 'GET', `desk:/modules/${X.TK}/records/${id}`); let d = ''; if (g.s === 200) d = (await api('o', 'DELETE', `desk:/modules/${X.TK}/records/${id}`)).s; o.res.push(id.slice(0, 8) + ' get ' + g.s + (d ? ' del ' + d : '')); }
const r = await api('o', 'GET', `desk:/modules/${X.TK}/records?page=1&per_page=5`); o.listShape = r.s + ' ' + r.t.slice(0, 200);
return o;
