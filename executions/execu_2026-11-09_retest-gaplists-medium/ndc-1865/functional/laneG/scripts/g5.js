eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};
const r1=await api('GET','/desk/assignment-rules?type=direct');const R=r1.j.data.rules||[];o.nDirect=R.length;o.activeDirect=R.filter(x=>x.is_active).map(x=>[x.name,x.id]);
const nm={[IDS.A]:'TestUser1',[IDS.B]:'QATeam1',[IDS.me]:'owner(creator)'};
const own=async id=>{const x=await getT(id);const v=oid(x.owner);return nm[v]||v;};
const rr=[];for(let i=5;i<=8;i++){rr.push(await mkTicket('QA FT 1865 RR ticket '+i,{owner:null},'(F6, owner:null)'));await sleep(1500);}
await sleep(8000);o.rrOwnerNull=[];for(const t of rr)o.rrOwnerNull.push(t.id?await own(t.id):t);
return o;
