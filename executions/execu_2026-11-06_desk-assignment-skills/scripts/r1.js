eval(require('fs').readFileSync('lib.js','utf8'));
const C=(v)=>({conditions:[{field_key:'subject',operator:'contains',value:v}],pattern:null}); const R={};
const rr=await mkRule({type:'round_robin',department_id:IDS.DA,name:'QA AS6 RR seq',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:C('QA AS6 SEQ'),method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1,IDS.A2,IDS.A3],team_id:null,excluded_user_ids:[]}}]});
R.rr=sh({s:rr.s,j:{error:rr.d&&rr.d.error},t:''}); R.rrS=rr.s; R.rrE=rr.e; IDS.RR_SEQ=rr.id;
const da=await mkRule({type:'direct',name:'QA AS6 DA D01',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:C('QA AS6 D01'),coming_to_department_id:IDS.DA,move_to_department_id:null,assign:{kind:'agent',user_id:IDS.A1,team_id:null}}]});
R.daS=da.s; R.daE=da.e; IDS.DA_D01=da.id; saveIds();
const tk=[]; for(let i=1;i<=3;i++){const t=await mkTicket('QA AS6 SEQ create '+i,IDS.DA); tk.push(t); }
const d1=await mkTicket('QA AS6 D01 a',IDS.DA);
R.createResp={s:tk[0].s,e:tk[0].e,ms:tk.map(t=>t.ms),ownerInResp:tk.map(t=>t.o&&JSON.stringify(t.o.owner))};
await sleep(6000);
R.seq=[];for(const t of tk) R.seq.push(await own(t.id));
R.d01=await own(d1.id); R.d01ms=d1.ms;
R.actSample=JSON.stringify(await act(tk[0].id)).slice(0,1500); R.actD01=JSON.stringify(await act(d1.id)).slice(0,1500);
return R;
