var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const s=JSON.parse(fs.readFileSync(OUT+'imp-set.json','utf8'));const PA=JSON.parse(fs.readFileSync(OUT+'imp-prefs-orig.json','utf8'));
const off=await setA(s.rule,false);const p=await setPrefs(PA,DA);const same=JSON.stringify(await prefs(DA))===JSON.stringify(PA);LED('QA AS6 Dept A prefs restored after import check '+same);
const f=await feed(s.control);
return {off,p:p.s,same,feed:f.map(e=>[e.action,JSON.stringify(e.summary||e.changes||'').slice(0,200)])};
