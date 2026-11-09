// 7 Nov G-06: event without owner change -> no assignment notification
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};
const r=await mkRule({type:'direct',name:'QA AS6 G06 same owner',description:'QA',is_active:true,execute_on:['create','update'],targets:[DT('QA AS6 G06',IDS.DA,null,AG(IDS.A1))]},'G-06');o.rule={s:r.s,e:r.e};IDS.DA_G06=r.id;saveIds();
if(r.id){const t=await mkTicket('QA AS6 G06 same owner',IDS.DA,{},'G-06');await sleep(4000);o.id=t.id;o.no=(await getT(t.id)).ticket_number;o.ownerAfterCreate=nm((await own(t.id)).owner);
 o.upd1=sh(await patchT(t.id,{priority:'High'})).s;await sleep(4000);o.ownerAfterUpd1=nm((await own(t.id)).owner);
 o.upd2=sh(await patchT(t.id,{status:'On Hold'})).s;await sleep(4000);o.ownerAfterUpd2=nm((await own(t.id)).owner);
 o.hist=await hist(t.id);
 o.off=(await setActive(r.id,false)).s;LED('G-06: rule QA AS6 G06 same owner deactivated');}
fs.writeFileSync('../out/kF-ticket.txt',String(o.no));
return o;
