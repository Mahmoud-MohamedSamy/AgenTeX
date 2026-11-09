eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const o={};const MINE=[...IDS.tickets,IDS.layout,IDS.fDec,IDS.fDef,IDS.fPick,IDS.fLk,IDS.dept];
const list=async(app)=>{const all=[];let cur='';for(let i=0;i<10;i++){const r=await api('GET','/audit/recycle-bin/items?'+(app?'app_key='+app+'&':'')+'limit=200'+(cur?'&cursor='+cur:''));const L=(r.j&&r.j.data)||[];all.push(...L);cur=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}return all;};
const a=await list('');const mine=a.filter(i=>MINE.includes(i.record_id));o.found=mine.map(i=>i.module_key+' / '+i.record_label);
if(mine.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:mine.map(i=>i.id)});o.purge=p.s+' '+p.t.slice(0,200);await sleep(3000);o.leftMine=(await list('')).filter(i=>MINE.includes(i.record_id)).length;}
LED('CLEANUP recycle bin: purged '+mine.length+' own items by record id; left '+o.leftMine);
const d=await api('DELETE','/desk/departments/'+IDS.dept);o.dept={s:d.s,e:E(d)};LED('CLEANUP department QA RT9 2174 Dept delete: '+d.s);
o.deptLeft=arr((await api('GET','/desk/departments')).j.data).filter(x=>x.id===IDS.dept).length;
return o;
