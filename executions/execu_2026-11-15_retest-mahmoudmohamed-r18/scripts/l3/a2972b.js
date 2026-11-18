const o={}; const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1));
const ag='44444444-4444-4444-4444-444444444402';
const p=await api('GET','/iam/profiles/'+ag+'/permissions'); o.agPerm=p.s+' '+p.t.slice(0,600);
const e=await api('GET','/iam/profiles/'+ag+'/effective'); o.agEff=e.s+' '+e.t.slice(0,400);
if(!I.PROF){ const c=await api('POST','/iam/profiles',{name:'QA RT18 profile',appKey:'desk',app_key:'desk',parentProfileId:ag,rank:20}); o.create=c.s+' '+c.t.slice(0,500); const id=c.j&&c.j.data&&(c.j.data.profileId||c.j.data.id); if(id){I.PROF=id;SAVE();fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} profile "QA RT18 profile" (desk, parent Desk Agent, rank 20) ${id} (Desk, lane 3)\n`);} }
if(I.PROF){ const g=await api('GET','/iam/profiles/'+I.PROF+'/permissions'); o.mine=g.s+' '+g.t.slice(0,600); const ef=await api('GET','/iam/profiles/'+I.PROF+'/effective'); o.mineEff=ef.s+' '+ef.t.slice(0,300); }
return o;
