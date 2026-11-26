const EV = JSON.parse(fs.readFileSync(RUN + '/evidence/plane-evidence2.json', 'utf8'));
const a = await api('DELETE', `/workflow/custom-actions/${EV.tf09.action}`); await sleep(1500); const s = await api('DELETE', `/workflow/custom-actions/sources/${EV.tf09.source}`);
return { action: E(a), source: E(s), left: arr((await api('GET', '/workflow/custom-actions')).j?.data).filter(x => /QA BP/.test(x.name || '')).length };
