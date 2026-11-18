var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const t=await tk('STATPROBE',{owner:A3,status:'On Hold'});const o=await rec(t);
const meta=(await api('GET','/modules/'+T+'/fields')).j?.data;const L=Array.isArray(meta)?meta:(meta?.fields||[]);const s=L.find(f=>(f.key||f.api_name)==='status');
return {t,status:o.status,owner:nm(o.owner),statusOpts:s&&JSON.stringify(s.options||s.picklist||s).slice(0,600),AOB:{A1:(await wl(A1,'4853562a-0b4d-45cb-ba34-9f2118fcd32c')),A3:(await wl(A3,'4853562a-0b4d-45cb-ba34-9f2118fcd32c'))}};
