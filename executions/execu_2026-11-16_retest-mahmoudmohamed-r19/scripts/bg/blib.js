var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
PFX='QA RT19 BUG';OUT=RUN+'/scripts/bg/out/';MADE=OUT+'made.json';made=fs.existsSync(MADE)?JSON.parse(fs.readFileSync(MADE,'utf8')):{rules:[],tickets:[],other:[]};
LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z BUG lane: '+m+'\n');
var AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';
var allRows=async()=>{const rows=[];for(let p=1;p<40;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){const o={id:r.id,ca:r.created_at};for(const x of r.data||[])o[x.field]=x.value?.value;rows.push(o);}if(!g.j?.meta?.more_records)break;}return rows;};
