var RUNP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG';
eval(require('fs').readFileSync(RUNP+'/scripts/lib.js','utf8'));
const o={};
// tag (needs confirm)
let r=await api('DELETE','/desk/tags/'+IDS.tag+'?confirm=true');if(r.s>=300)r=await api('DELETE','/desk/tags/'+IDS.tag,{confirm:true});o.tag=r.s+(r.s>=300?' '+E(r):'');LED('CLEANUP delete tag (confirm): '+r.s);
const MINE=[...IDS.tickets,IDS.bp,IDS.sla,...(IDS.wf||[]),IDS.wfAction,IDS.tag,...(IDS.rules||[]),IDS.layout,IDS.fTxt,IDS.fPick,IDS.D].filter(Boolean);
const list=async()=>{const all=[];let cur='';for(let i=0;i<10;i++){const q=await api('GET','/audit/recycle-bin/items?limit=200'+(cur?'&cursor='+cur:''));const L=(q.j&&q.j.data)||[];all.push(...L);cur=q.j&&q.j.meta&&q.j.meta.next_cursor;if(!cur)break;}return all;};
const purge=async(tag)=>{const mine=(await list()).filter(i=>MINE.includes(i.record_id));o['bin_'+tag]=mine.map(i=>i.module_key+' / '+i.record_label);if(mine.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:mine.map(i=>i.id)});o['purge_'+tag]=p.s;LED('CLEANUP recycle bin purge ('+tag+'): '+mine.length+' own items by record id: '+p.s);}await sleep(3000);return (await list()).filter(i=>MINE.includes(i.record_id)).length;};
o.left1=await purge('1');
const d=await api('DELETE','/desk/departments/'+IDS.D);o.dept=d.s+(d.s>=300?' '+E(d):'');LED('CLEANUP delete department QA FT 1865 Dept: '+d.s);
await sleep(3000);o.left2=await purge('2');
// verify
const chk={};
for(const id of IDS.tickets)chk['t'+id.slice(0,6)]=(await api('GET','/modules/'+T+'/records/'+id)).s;
chk.dept=(await api('GET','/desk/departments/'+IDS.D)).s;chk.bp=(await api('GET','/modules/'+T+'/blueprints/'+IDS.bp)).s;chk.sla=(await api('GET','/desk/sla/policies/'+IDS.sla)).s;
chk.wfa=(await api('GET','/workflow/actions/'+IDS.wfAction)).s;for(const id of IDS.wf)chk['wf'+id.slice(0,6)]=(await api('GET','/workflow/rules/'+id)).s;
chk.layout=(await api('GET','/modules/'+T+'/layouts/'+IDS.layout)).s;
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);chk.fieldsLeft=F.filter(f=>/qa_ft1865/.test(f.fieldName)).length;
chk.tagsLeft=JSON.stringify((await api('GET','/desk/tags')).j).includes('QA FT 1865');
chk.rulesLeft=JSON.stringify((await api('GET','/desk/assignment-rules?type=direct')).j).includes('QA FT 1865');
chk.master=(await api('GET','/desk/assignment/notification-settings')).j.data;
o.verify=chk;o.binLeft=(await list()).filter(i=>MINE.includes(i.record_id)).length;
LED('VERIFY after cleanup: '+JSON.stringify({binLeft:o.binLeft,dept:chk.dept,fieldsLeft:chk.fieldsLeft,tagsLeft:chk.tagsLeft,rulesLeft:chk.rulesLeft}));
return o;
